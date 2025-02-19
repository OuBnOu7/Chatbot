from rdflib import Graph

class OntologyModel:
    def __init__(self):
        self.graph = Graph()
        self.load_ontologies()

    def load_ontologies(self):
        self.graph.parse("ontologies/ONTOLOGIE-application.ttl", format="ttl")
        self.graph.parse("ontologies/ontologie-competences-enseignement.ttl", format="ttl")
        self.graph.parse("ontologies/ontologie-IA.ttl", format="ttl")

    def get_formations(self):
        query = """
        PREFIX : <http://www.semanticweb.org/raphaelseve/ontologies/2025/0/untitled-ontology-15/>
        PREFIX ece: <http://www.semanticweb.org/axelp/ontologies/2025/0/untitled-ontology-9#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        SELECT ?formation ?formationType ?formationDuration ?cout ?prec ?school ?ue ?ueDuration ?ecue ?ecueDuration ?competence
        WHERE {
          ?subclass rdfs:subClassOf* :Formation .
          ?formation rdf:type ?subclass .
          ?formation rdf:type ?formationType .
          FILTER (?formationType != owl:NamedIndividual)
          OPTIONAL { ?formation :cout ?cout . }
          OPTIONAL { ?formation :prérequis_academique ?prec . }
          OPTIONAL { ?school :propose ?formation . }
          OPTIONAL { ?formation ece:duree_en_heures ?formationDuration . }
          OPTIONAL {
            ?formation :contientUE ?ue .
            OPTIONAL { ?ue ece:duree_en_heures ?ueDuration . }
            OPTIONAL {
              ?ue :contientECUE ?ecue .
              OPTIONAL { ?ecue ece:duree_en_heures ?ecueDuration . }

            }
            OPTIONAL {
              ?ue ece:permetdAcquerir ?competence .
            }
          }
        }
            """

        res = self.graph.query(query)

        results = {}
        for row in res:
            formation_local = row.formation.split('#')[-1] if '#' in row.formation else row.formation.split('/')[-1]
            formation_type_local = row.formationType.split('#')[-1] if '#' in row.formationType else row.formationType.split('/')[-1]
            cout = str(row.cout) if row.cout else None
            prec = str(row.prec) if row.cout else None
            formation_duration = str(row.formationDuration) if row.formationDuration else None
            school_local = row.school.split('#')[-1] if row.school and '#' in row.school else row.school.split('/')[-1] if row.school else None
            ue_local = row.ue.split('#')[-1] if row.ue and '#' in row.ue else row.ue.split('/')[-1] if row.ue else None
            ue_duration = str(row.ueDuration) if row.ueDuration else None
            ecue_local = row.ecue.split('#')[-1] if row.ecue and '#' in row.ecue else row.ecue.split('/')[-1] if row.ecue else None
            ecue_duration = str(row.ecueDuration) if row.ecueDuration else None
            competence_local = row.competence.split('#')[-1] if row.competence and '#' in row.competence else row.competence.split('/')[-1] if row.competence else None

            if formation_local not in results:
                results[formation_local] = {
                    "formation": formation_local,
                    "type": formation_type_local,
                    "cout": cout,
                    "Prérequis académique": prec,
                    "school": school_local,
                    "duration": formation_duration,
                    "ues": {}
                }
            if ue_local:
                if ue_local not in results[formation_local]["ues"]:
                    results[formation_local]["ues"][ue_local] = {
                        "label": ue_local,
                        "duration": ue_duration,
                        "ecues": [],
                        "competences":set() 
                    }
                if ecue_local:
                    results[formation_local]["ues"][ue_local]["ecues"].append({
                        "ecue": ecue_local,
                        "duration": ecue_duration
                    })
                if competence_local:
                    results[formation_local]["ues"][ue_local]["competences"].add(competence_local)


        final_results = []
        for formation in results.values():
            for ue in formation["ues"].values():
                ue["competences"] = list(ue["competences"]) 
            formation["ues"] = list(formation["ues"].values())
            final_results.append(formation)

        return final_results