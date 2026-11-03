# Knowledge sources

knowledge-registry.json includes a profile summary from the original public CV and 15 project summaries from src/data/projects.json, each with a public source reference. No new clients, prices or measured outcomes are generated. retrieveSeraFacts returns at most three relevant facts within 1,400 characters and abstains when nothing matches. Tests confirm Morganics relevance, source references and bounds. Ask About Hadi uses the profile fact locally.

Existing approved knowledge.json, policy and chat factual replies remain. The new retrieval utility is not yet connected to backend model requests; current backend context budgeting must be reviewed before router activation. CV is not sent wholesale by the new feature. Full factual/adversarial evaluation, working-arrangement facts and unknown-claim response testing remain incomplete.
