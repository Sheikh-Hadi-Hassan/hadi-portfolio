"""Real independent-process quota contention; no providers or credentials."""
import concurrent.futures,json,os,pathlib,subprocess,tempfile
php=os.environ.get('PHP_BINARY','php')
source=pathlib.Path('public/intellignce-support/provider-ledger.php').resolve()
with tempfile.TemporaryDirectory(prefix='sera-contention-') as root:
    ledger=pathlib.Path(root)/'sera-usage-concurrent.json'
    code='require $argv[1]; $l=new SeraProviderLedger($argv[2],true); echo $l->reserve("model","fixed-period",3,100)?"yes":"no";'
    def reserve(_):
        return subprocess.run([php,'-r',code,str(source),str(ledger)],check=True,capture_output=True,text=True).stdout
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results=list(pool.map(reserve,range(20)))
    assert results.count('yes')==3,results
    assert json.loads(ledger.read_text())['model']['used']==3
    ledger.write_text('')
    result=subprocess.run([php,'-r',code,str(source),str(ledger)],capture_output=True,text=True)
    assert result.returncode!=0 and 'PROVIDER_LEDGER_INVALID' in result.stderr+result.stdout
print('PASS: 20 independent PHP processes accept exactly 3 reservations; empty-corrupt ledger fails closed.')
