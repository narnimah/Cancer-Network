# CS5331Project3

 NETWORK VISUALIZATION
Please click to watch the overview video :<br>
[![ScreenShot](http://img.youtube.com/vi/RMkJD_9dkck/0.jpg)]

(https://youtu.be/RMkJD_9dkck)

URL link:https://narnimah.github.io/Cancer-Network/index.html

Major Features:

•	The project gives a network visualization of the protein network comprising of different cancer study id's which are related based on their common genes.

•	Here we have extracted the common genes among different cancer study id's after preprocessing the data from Web API of cBioportal website using python.

•	The user interface was designed using HTML, CSS, D3 and Bootstrap to help users visualize, analyze and get quick insights into common genes that relates different cancer types.

•	Firstly we have created the protien network by considering only 25 different cancer study id's.On clicking on a particular cancer study id,a parallel co-ordinate system appears representing the clinical data of the same. The clinical data is being read dynamically from the WEBAPI.

•	In the parallel co-ordinate system the user gets to know a lot of useful information such as PatientID,diagonsis age,treatment type,gender,operation type etc foe each cancer study id.There is slider also available in each of the vertices of the parallel co-rdinate system that gives a better view if need to concentrate and look in a particular range.

•	Also we have made sure that the colour of the nodes matches with colour of the cancer study types that are world wide accepted.

•	We have also implemented the bubble chart, here the user is allowed to click on the link connecting different cancer protiens. On clicking on  a particular link connecting two protiens, we compute the common genes that are present in both cancer study id's. After computing the common genes, the same is displayed in the form of bubble chart



Duties of each Member in the Team:

•	Richard Matovu: Protien Network,Bubble Chart

•	Upama Nakarmi:  Parallel Co-ordinate System,Bubble Chart

•	Nikitha Mahesh : Parallel Co-ordinate System,Bubble Chart

Software Requirements:
Text Editor: Sublime
Languages used : javascript and D3
Operating System: windows 10
Server : wamp server

SCREENSHOTS

Home Page 
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_homepg.PNG)

Protien Network generated based on 25 different cancer study ID's.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_protien_network.PNG)

On hovering the mouse over a particular cancer study id,we see all the other cancer study id's that are related to this cancer study being highlighted.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_protien_related.png)

We also have index representing the colors of the nodes for the different cancer types.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/index.PNG)

On clicking on a particular cancer study id node,a parallel co-ordinate system for the same is generated.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_parallel_coord.PNG)

In the parallel co-ordinate system,we can use the slider along each of the vertices to look in for data in a particular range.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_parallel_slider.PNG)

On clicking on a particular link connecting two protiens,a bubble chart representing the common genes between then is generated.
![ScreenShot](https://github.com/matrich/CS5331Project3/blob/master/new_bubble.PNG)

