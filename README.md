# Breath Yield

[Open the interactive workbench](https://rounakdas07.github.io/breath-yield/)

**When can a breath sample add a confirmed molecular finding after the standard lung cancer testing pathway?** This independent research demo by Rounak Das, a medical student at Nottingham, has two views.

1. **Explore published assay failures.** In a 125-person cohort, tissue, plasma and breath had 57, 27 and 26 failures due to unamplifiable DNA, respectively. Those counts allow anywhere from zero to 27 people to have failed on both tissue and plasma. Move the overlap slider to see how many of those people could have had an amplifiable breath sample. These are feasible bounds, not estimates of assay sensitivity.
2. **Measure added yield with paired counts.** Enter aggregate counts from a single eligible cohort. Follow each stage from the standard pathway, through breath testing, to an independently confirmed new prespecified actionable finding. Compare whole-cohort and unresolved-subgroup denominators and export the analysis with its inputs. Default counts are synthetic.

## A 30-second example

Select 27 double failures in the published example. Since only 26 breath samples failed in the entire study, at least one of those 27 would have yielded amplifiable breath DNA under that overlap assumption. Whether it added a confirmed target is a separate question. In the hypothetical worksheet, 5 confirmed additional people among 100 eligible gives 5.0% added yield (95% Wilson interval 2.2–11.2%). The same five represent 9.1% of the 55 without a standard-pathway target.

## Interpretation and evidence

The three published counts describe technical failures under the assays in [Ryan, Toomey et al. (2022)](https://pubmed.ncbi.nlm.nih.gov/35526313/). Assays and panels differed. The worksheet models a molecular profiling question in a defined cohort. Population screening performance, predictive value and clinical utility require other designs. None of the figures comes from Respiro or the Aalborg study. This project is independent and uncommissioned.

For N participants, failures T and P have possible intersection d between max(0,T+P−N) and min(T,P). Given d and B breath failures, the number in the double-failure group with amplifiable breath ranges from max(0,d−B) to min(d,N−B). No independence assumption is needed. In the worksheet, hold timing, target definitions, assay coverage and independent confirmation rules fixed. Each person is counted once. Results are descriptive and sensitive to missingness and verification bias.

Other primary evidence: [pretreatment lung adenocarcinoma and paired specimens](https://pubmed.ncbi.nlm.nih.gov/32031993/), [PLUREX and unsuccessful EBC DNA recovery](https://pmc.ncbi.nlm.nih.gov/articles/PMC8582482/), [paired fusion transcript analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC11732855/). This focused selection illustrates methodological differences. It is not a systematic review. [NHS plasma-first pathway context](https://www.england.nhs.uk/2025/05/nhs-first-in-world-to-roll-out-revolutionary-blood-test-for-cancer-patients/).

## Run locally

Download the repository and open `index.html` in a browser. The app has no package dependencies, network calls or analytics. Calculations run locally. Optional tests: `node --test model.test.js` with Node 20 or later. Implementation and tests developed with AI assistance.
