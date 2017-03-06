/**
 * Created by Tom on 9/17/14.
 */
Ext.define('Ext.ux.grid.GridPrefs', {
    alias: 'plugin.gridprefs',
    init: function (grid) {
        var me = this;
        grid.on('afterrender', me.onAfterRender, me);
        grid.on('beforerender', me.applyPrefs, me);
        me.storeListener = grid.getStore().on({
            destroyable: true,
            beforeload: function (store) {
                me.applySort(grid, store);
            },
            load: function (store) {
                if (store.remoteSort) {
                    delete store.getProxy().extraParams.sort;
                    delete store.getProxy().extraParams.dir;
                }
                me.storeListener.destroy();
            }
        });
        grid.on('close', function () {
            grid.getStore().removeAll();
        });
    },
    saveState: function (grid) {
        var headerCt = grid.view.headerCt,
            alias = 'widget.' + grid.getXType(),
            columns = [], sorters, sortField, sortDir;
        Ext.each(headerCt.getGridColumns(), function (column) {
            columns.push({
                colid: column.getReference(),
                colindex: column.fullColumnIndex,
                hidden: column.isHidden(),
                colwidth: (!column.getWidth()) ? 100 : column.getWidth()
            });
        });
        if (grid.getStore().isSorted()) {
            sorters = grid.getStore().getSorters();
            if (sorters.items[0]) {
                sortField = sorters.items[0].config.property;
                sortDir = sorters.items[0].config.direction;
            }
        }
        Ext.Ajax.request({
            url: 'user/prefs/grid_column',
            method: 'POST',
            params: {
                cmd: 'save',
                jsid: alias,
                columns: Ext.encode(columns),
                sortfield: sortField,
                sortdir: sortDir
            },
            success: function (result, opt) {
                Ext.getStore('user.GridPrefs').reload();
            }
        });
    },
    onAfterRender: function (grid) {
        var me = this,
            headerCt = grid.view.headerCt,
            menu = headerCt.getMenu(),
            alias = 'widget.' + grid.getXType();
        if (!menu.down('#gridprefs')) {
            menu.add({
                    text: 'Save Columns',
                    itemId: 'gridprefs',
                    icon: 'images/icons/save.png',
                    handler: function () {
                        me.saveState(grid);
                    }
                },
                {
                    text: 'Reset Columns',
                    icon: 'images/icons/reload.png',
                    handler: function () {
                        Ext.Ajax.request({
                            url: 'user/prefs/grid_column',
                            method: 'POST',
                            params: {
                                cmd: 'reset',
                                jsid: alias
                            },
                            success: function (result, opt) {
                                Ext.getStore('user.GridPrefs').reload();
                            }
                        });
                    }
                }
            );
        }
    },
    applySort: function (grid, store) {
        var gc = Ext.getStore('user.GridPrefs'),
            alias = 'widget.' + grid.getXType(),
            colRecords = gc.query('jsid', alias),
            record = colRecords.items;
        if (record[0]) {
            var sortField = record[0].get('sortfield'),
                sortDir = record[0].get('sortdir');
            if (store.remoteSort) {
                store.getProxy().setExtraParam('sort', sortField);
                store.getProxy().setExtraParam('dir', sortDir);
            }
            else {
                store.sort(sortField, sortDir);
            }
        }
    },
    applyPrefs: function (grid) {
        var column, jsId, colId, colIndex, colWidth, hidden, curIndex,
            gridView = grid.view,
            headerCt = gridView.headerCt,
            gc = Ext.getStore('user.GridPrefs'),
            alias = 'widget.' + grid.getXType(),
            colRecords = gc.query('jsid', alias);
        if (colRecords) {
            jsId = false;
            Ext.each(colRecords.items, function (record, index) {
                jsId = record.get('jsid');
                if (alias == jsId) {
                    colId = record.get('colid');
                    colIndex = record.get('colindex');
                    hidden = record.get('hidden');
                    colWidth = record.get('colwidth');
                    //position columns
                    if (colIndex || colIndex == 0) {
                        column = grid.lookupReference(colId);
                        curIndex = column.getIndex();
                        if (curIndex != colIndex) {
                            headerCt.move(curIndex, colIndex);
                        }
                        //set hidden
                        if (hidden == 1) {
                            column.hidden = true;
                            //column.setHidden(true);
                        }
                        else {
                            column.hidden = false;
                            //column.setHidden(false);
                        }
                        //set widths
                        if (colWidth) {
                            column.setWidth(colWidth);
                            //column.width = colWidth;
                        }
                    }
                }
            });
        }
    }
});
