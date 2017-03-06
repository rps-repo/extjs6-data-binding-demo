Ext.define("Overrides.PagingToolbar", {
    override: 'Ext.toolbar.Paging',
    doRefresh: function() {
        var me = this,
            store = me.store,
            current = store.currentPage;
        if (me.fireEvent('beforechange', me, current) !== false) {
            store.loadPage(current);
            me.fireEvent('toolbarrefresh');
            return true;
        }
        return false;
    }
});