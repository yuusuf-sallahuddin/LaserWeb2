
# LaserWeb2

Laserweb (https://github.com/openhardwarecoza/LaserWeb) was born out of a need! Last year when I gave up on getting a certain well known open source java based laser cutting software to work and my skills at the time didnt allow me to complete my development inside Chilipeppr - i caved in and did what I could to help myself get going! The result of which astounds even me! In just over three months LaserWeb grew to be a massively successful opensource project!  But its not without its flaws...

Thus, this here is it's successor: LaserWeb2!

## Sponsors
Have a look at companies and individuals that support us financially or with parts donations, or if you would like to get involved by sponsoring us in any way, please see the Sponsors Page on the wiki: https://github.com/openhardwarecoza/LaserWeb/wiki/SPONSORS

## Disclaimer
By using this software, the user accepts complete responsibility for each and every aspect of safety associated with the use of the Laser machine, Laser system and LaserWeb2 Software.

####You agree that:

1. You will not hold the author or contributors of LaserWeb liable for any damage to equipment or persons from the use of LaserWeb2. 
2. You know the potential hazards in using high power lasers and high voltages.
3. You will wear professional laser-eye-protection when using a laser controlled by LaserWeb2.
4. You will use the LaserWeb2 software in a legal and safe manner.
5. You relieve the author and contributors from any liability arising from the use or distribution of the LaserWeb2 software.
6. You are entirely operating at your own risk. Lasers can be lethally dangerous. 


#Usage Instructions:

1. Go to [http://openhardwarecoza.github.io/LaserWeb2/](http://openhardwarecoza.github.io/LaserWeb2/)
2. Install Serial Port JSON Server https://github.com/chilipeppr/serial-port-json-server/releases
3. Click the Settings tab in LaserWeb2's web interface and configure for your machine, IP of SPJS, GCODE dialect, etc
4. Connect and PLAY
 


#Support / Community:
* For End User support (Usage, setup etc) please join [https://plus.google.com/communities/115879488566665599508](https://plus.google.com/communities/115879488566665599508)
* For Development Support (Bugs, feature requests, API, etc) see 
[https://github.com/openhardwarecoza/LaserWeb2/issues](https://github.com/openhardwarecoza/LaserWeb2/issues)


## Internal module development
It would be more maintainable if we could develop more functional modules, that are tested.

<i>Example</i>: grbl.js has test code. It is a stand alone module that parses messages from a grbl device and stores all data in the grbl object, created by ` var grbl = new Grbl()` 
### how to test
``` 
npm install // installs mocha and chai
npm test // runs test code on grbl.js
```

#Roadmap

As of middle May 2016:

![Roadmap](https://raw.githubusercontent.com/openhardwarecoza/LaserWeb2/gh-pages/Roadmap-%20LaserWeb2.png)
