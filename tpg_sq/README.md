TPG SQ
=======

Overview
--------
This module provides all the functionality required to provide a address entry and SQ parsing feature.

Requirements
------------
Boostrap - boostrap.css and bootstrap.js

Installation
------------
Simply install this module, the 'SQ Address' block is automatically placed in the Content region on the front page.
For placements in other pages please configure the block.

User Extension
-------------

*Variables*
The template allows some customisation using variables:

| Variable      | Description                                                       | Default Value                     |
|-------------- | ----------------------------------------------------------------- | --------------------------------- |
| title         | The heading before the address input box                          | Let's check your address to get started   |
| placeholder   | The placeholder text inside the input box when there is no text   | Please enter your address         |
| show_address  | If true this will show the address you entered in in the output   |                                   |

*SQ Actions*
You can create a function called 'sqActions' in your pages JavaScript code that will be called when the SQ is completed.

The following values will be passed into the function:
status, msg, action, page, data

Your custom function should return a boolean.

* If true it will show the results inside the modal
* If false it will not show the results

Author
------
Adrian Pennington <apennington@staff.iinet.net.au>
