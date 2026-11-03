# Knowledge sources

knowledge-registry.json includes a profile summary from the original public CV and 15 project summaries from src/data/projects.json, each with a public source reference. No new clients, prices or measured outcomes are generated. retrieveSeraFacts returns at most three relevant facts within 1,400 characters and abstains when nothing matches. Tests confirm Morganics relevance, source references and bounds. Ask About Hadi uses the profile fact locally.

Existing approved knowledge.json, policy and chat factual replies remain. The backend retrieval helper is now connected to model request construction; router activation still requires separate adapter/eligibility work. CV is not sent wholesale by the new feature. Full factual/adversarial evaluation, working-arrangement facts and unknown-claim response testing remain incomplete.

Backend retrieval is now wired into ask.php: at most three relevant registry/FAQ records within 1,800 serialized bytes replace the full FAQ dump. Client facts are capped at eight × 280 characters; history at four × 300; requested output is 600 tokens. PHP retrieval and syntax tests pass. Live answer quality remains unverified.
