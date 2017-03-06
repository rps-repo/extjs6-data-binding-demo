/*
 * File: app/model/Person.js
 *
 * This file was generated by Sencha Architect version 4.1.1.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.2.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.2.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('DataBindingDemo.model.Person', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.field.Field'
    ],

    fields: [
        {
            name: 'id'
        },
        {
            name: 'fname'
        },
        {
            name: 'lname'
        },
        {
            calculate: function(data) {
                var d = (data.fname && data.lname) ? data.fname + " " +data.lname : data.fname || data.lname;
                return d;
            },
            name: 'name'
        },
        {
            name: 'age'
        }
    ]
});