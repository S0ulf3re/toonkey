# Pages

## Variables
Vous pouvez créer des pages dynamiques en utilisant des variables.Vous pouvez incorporer la valeur d'une variable en insérant le <b>{ variablename }</b> dans votre texte.Par exemple, si la valeur de la variable "thing" dans le texte <b>Hello { thing } world!</b> est <b>ai</b>, votre trexte devient alors : <b>Hello ai world!</b>.

Les variables sont évaluées du haut vers le bas, il n'est donc pas possible de référencer une variable située plus bas que celle en cours.Par exemple, si vous définissez, dans l'ordre, 3 variables telles que <b>A、B、C</b>, vous pourrez référencer en <b>C</b> aussi bien <b>A</b> que <b>B</b> ; par contre, vous ne pourrez référencer en <b>A</b> ni <b>B</b> ni <b>C</b>.

Pour recevoir une entrée utilisateur, ajoutez un bloc "Entrée" sur la page et définissez le nom des variables que vous souhaitez stocker dans le champ "Nom de la variable" (les variables seront créées automatiquement).Vous pourrez alors exécuter les actions en fonction de l'entrée utilisateur de ces variables.

Utiliser des fonctions vous permettra de mettre en place une façon de calculer des valeurs que vous pourrez réutiliser.Pour créer des fonctions, il faut d'abord définir une variable du type "fonction".Ensuite, vous pouvez configurer des arguments dont la valeur sera utilisable comme une variable à l'intérieur de la fonction. Par ailleurs, il existe ce que l'on appelle des "fonctions d'ordre supérieur" dont les arguments sont aussi des fonctions. En plus de paramétrer des fonctions à l'avance, vous avez également la possibilité de définir des fonctions à l'improviste directement dans les arguments de ces "fonctions d'ordre supérieur".
