/*
 * File: app/view/PersonGridViewController.js
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

Ext.define('DataBindingDemo.view.PersonGridViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.persongrid',

    onGridButton: function(button) {

        var itemId = button.getItemId(),
                    vm = this.getView().up('#mainPanel').getViewModel(),
                    store = vm.getStore('persons'),
                    record;
                if (itemId === 'add') {
                    record = store.insert(0, {})[0];
                    vm.set('currentPerson', record);
                }
                if (itemId === 'reject') {
                    store.rejectChanges();
                }
                if (itemId === 'commit') {
                    store.commitChanges();
                    record = vm.get('currentPerson');
                    record.commit();
                    record.reject();
                }

    },

    onGridpanelSelect: function(rowmodel, record, index, eOpts) {
        this.getView().setCurrentPerson(record);
    }

});
