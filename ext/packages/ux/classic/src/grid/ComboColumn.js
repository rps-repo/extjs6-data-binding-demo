Ext.define('Ext.ux.grid.ComboColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.combocolumn',

    initComponent: function() {
        var me = this,
            combo = me.editor,
            grid, store;
        me.callParent(arguments);
        me.on('render', function() {
            grid = me.up('grid');
            if (combo) {
                if (me.parentItemId){
                    var parent = me.up('#' + me.parentItemId),
                        storeName = combo.bind.store.replace(/[{}]/g,'');
                    store = parent.getController().getStore(storeName);
                }
                else{
                    store = Ext.getStore(combo.store);
                }
                me.renderer = function(value, metaData) {
                    if (me.backgroundColor){
                        metaData.tdAttr = 'style="background-color: ' + me.backgroundColor + ';"';
                    }
                    var getValue = function(value) {
                        //var idx = store.find(combo.valueField, value);
                        //var rec = store.getAt(idx);
                        var rec = store.findRecord(combo.valueField, value, 0, false, false, true);
                        if (rec) {
                            return rec.get(combo.displayField);
                        }
                        return value;
                    };
                    var loadCombo = function(value) {
                        if (store.getCount() == 0) {
                            store.load({
                                scope: this,
                                callback: function(records, operation, success) {
                                    // refresh grid after store.load, console.log(records);
                                    if (success) {
                                        grid.view.refresh();
                                    }
                                }
                            });
                        } else {
                            return getValue(value);
                        }
                    };
                    return loadCombo(value);
                };
            }
        });
    }
});