// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('exam-nosql');


// 1. INSERTION

/* Insérez deux nouveaux sets Lego intitulé "Lego Creator 3-in-1" et "Faucon Millenium"  avec les informations suivantes :

Lego Creator 3-in-1 :
    Année de sortie : 2020
    Nombre de pièces : 564
    Prix : 59.99 €
    Evaluations : Uniquement l'utilisateur "Charlie" avec une note de 4.

Faucon Millenium :
    Année de sortie : 2019
    Nombre de pièces : 1050
    Prix : 89.99 €
    Thème : Star Wars
    Evaluations : Utilisateurs "David" (note 5) et "Eve" (note 3).    
*/
db.lego.insertMany([
    {
        'nom': 'Lego Creator 3-in-1',
        'annee_sortie': 2020,
        'nombre_de_pieces': 564,
        'prix': 59.99,
        'evaluations': [
            {
                'utilisateur': 'Charlie',
                'note': 4
            }
        ]
    },
    {
        'nom': 'Faucon Millenium',
        'annee_sortie': 2019,
        'nombre_de_pieces': 1050,
        'prix': 89.99,
        'theme': 'Star Wars',
        'evaluations': [
            {
                'utilisateur': 'David',
                'note': 5
            },
            {
                'utilisateur': 'Eve',
                'note': 3
            }
        ]
    }
]);


// 2. MODIFICATION

// a. Mettez à jour le prix du set "Lego Creator 3-in-1" à 49.99 €.
db.lego.updateOne(
    {
        'nom': 'Lego Creator 3-in-1'
    },
    {
        $set: {
            'prix': 49.99
        }
    }
);

// b. Ajoutez une évaluation de l'utilisateur "Frank" avec une note de 4 pour le set "Millennium Falcon".
db.lego.updateOne(
    {
        'nom': 'Faucon Millenium'
    },
    {
        $addToSet: {
            'evaluations': {
                'utilisateur': 'Frank',
                'note': 4
            }
        }
    }
);


// 3. RECHERCHE

// a) Listez tous les sets Lego ayant pour thème "Star Wars", triés par année de sortie en ordre décroissant.
db.lego.find(
    {
        'theme': 'Star Wars'
    }
).sort(
    {
        'annee_sortie': -1
    }
);

// b) Listez les sets Lego qui ont un prix supérieur à 100€, triés par nombre de pièces décroissant.
db.lego.find(
    {
        'prix': {
            $gt: 100
        }
    }
).sort(
    {
        'nombre_de_pieces': -1
    }
);

// c) Lister les 3 sets Lego qui ont le plus de figurines, afficher uniquement leur nom et le nombre de figurines.
db.lego.find(
    {},
    {
        '_id': 0,
        'nom': 1,
        'nombre_de_figures': 1
    }
).sort(
    {
        'nombre_de_figures': -1
    }
).limit(3);

// d) Trouvez les sets Lego avec une ou plusieurs évaluations supérieures ou égales à 4.
db.lego.find(
    {
        'evaluations.note': {
            $gte: 4
        }
    }
);

// e) Trouvez les sets Lego ayant le thème "Technic" ou "Creator" et dont le nombre de pièces est inférieur à 2000.
db.lego.find(
    {
        'theme': {
            $in: ['Technic', 'Creator']
        },
        'nombre_de_pieces': {
            $lt: 2000
        }
    }
);

// f) Trouvez tous les sets Lego avec le thème "Harry Potter" publiés entre 2000 et 2010.
db.lego.find(
    {
        'theme': 'Harry Potter',
        'annee_sortie': {
            $gte: 2000,
            $lte: 2010
        }
    }
);

// g) Trouvez les gros sets Lego les plus populaires, c’est-à-dire ceux dont la moyenne des évaluations est supérieure ou égale à 4 et dont le nombre de pièces est supérieur à 1000.
db.lego.aggregate([
    {
        $project: {
            '_id': 0,
            'nom': 1,
            'nombre_de_pieces': 1,
            'moyenne_notes': {
                $avg: '$evaluations.note'
            }
        }
    },
    {
        $match: {
            'moyenne_notes': {
                $gte: 4
            },
            'nombre_de_pieces': {
                $gt: 1000
            }
        }
    }
]);

// h) Trouvez les sets Lego qui ont uniquement des évaluations de 5/5.
db.lego.find(
    {
        'evaluations': {
            $not: {
                $elemMatch: {
                    'note': { $ne: 5 }
                }
            }
        }
    }
);


// 4. SUPPRESSION

// a. Supprimez l'évaluation de l'utilisateur "Bob" pour le set "Faucon Millenium" de 2019.
db.lego.updateOne(
    {
        'nom': 'Faucon Millenium',
        'annee_sortie': 2019
    },
    {
        $pull: {
            'evaluations': {
                'utilisateur': 'Frank' // --> Je supprime l'évaluation de Frank car pas de Bob
            }
        }
    }
);

// b. Supprimez tous les sets Lego dont le nombre de pièces est inférieur à 1000.
db.lego.deleteMany(
    {
        'nombre_de_pieces': {
            $lt: 1000
        }
    }
);
