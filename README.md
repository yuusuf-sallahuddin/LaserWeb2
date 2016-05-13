
# LaserWeb2

Laserweb (https://github.com/openhardwarecoza/LaserWeb) was born out of a need! Last year when I gave up on getting a certain well known open source java based laser cutting software to work and my skills at the time didnt allow me to complete my development inside Chilipeppr - i caved in and did what I could to help myself get going! The result of which astounds even me! In just over three months LaserWeb grew to be a massively successful opensource project!  But its not without its flaws...

Thus, this here is it's successor: LaserWeb2!

Want to get involved? Simple - we have a couple of Contributors on the project, who have devoted time and effort into making LaserWeb better than it was before they joined. Many of these contributors do it for nothing more than the passion of working on an open source project, and some don't even own a laser.

Through the wonder that is the global open source community, however, lack of a laser hasn't stopped them! If you follow our team on Google Plus you'll know that we sometimes go as far as having three or four people in different time zones, collaborating on code, while having someone else in the team test it out on real hardware. It has not been easy, but we won't let that stop us!

##Sponsors

So how can I help?

*Easy! Pick a contributor, and show them you care! *

If you sell laser machines / parts / electronics / anything remotely related - I am happy to say we'll gladly take your bribe in exchange for sticking your logo on this page and linking to your stores! We'll probably even hook up the hardware you donate and figure out how it works and add that info/specifics/settings to this Wiki! If you have any business common sense, you can see that it is a pretty good ROI out of your marketing budget (;

Don't always send it to me (@openhardwarecoza) - please also send donations / hardware to our Contributors !
Sponsors:

    Robots-everywhere.com

Shop: http://robots-everywhere.com/re_site/purchase/l-cheapo/

-- MK B donated one of their 3.5w MK3 diodes! Arrived today, can't wait to hook it up (7 April 2016)

https://lh3.googleusercontent.com/-ZQ8L6QLhd00/VwZa9BJ25lI/AAAAAAAAPxM/t9fssBndBy4ww8mAxlkdsjx3TbQ1AMJBQ/w1580-h889-no/2016%2B-%2B1

    OpenBuildsPartStore.com

Shop: http://openbuildspartstore.com/

-- Mark, as always is supporting the work I do!

http://cdn1.bigcommerce.com/server2300/itwgldve/product_images/OpenbuildsSTORE_logo_Header_Small1.png
Paypal Links

If you have contributed anything to this project, even a single wiki entry or fixed one line of code, please add your Paypal link below: We believe in paying it forward!

-paypal

*@openhardwarecoza: If you would like to help with paying the prototyping costs, you can shoot me a donation on Paypal if you wish: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=45DXEXK9LJSWU or support me on Patreon: https://www.patreon.com/openhardwarecoza - also, I post all personal donations on https://plus.google.com/collection/UtfYZB Alternatively you can support me by buying anything from these stores using my affiliate link: https://www.banggood.com/?p=HO1614632392201406RX

*@funinthefalls: If you like my work on the LaserWeb Wiki or the bug hunting I have been doing, I would gladly accept any donation (monetary or hardware) to help prototype my Laser Safety System: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HMLY2MKN9XV98 (Thank you Peter for letting me post this donation link!)

*@nathanielstenzel: I have helped some with the raster image support, some code cleanup, etc. Pay Pal seems to have red tape for donation buttons, so just call it a thank you if you send me money to thank me for my work. I would gladly accept hardware like a laser diode with driver board. I could mount that on my little CNC router.

*Ariel Yahni@cojarbi: Just a happy tester having fun and learning from this guys. Donation greatly appreciated, i need to get myself a CO2 laser

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
