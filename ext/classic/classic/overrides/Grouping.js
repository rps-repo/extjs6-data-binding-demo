Ext.define("Overrides.Grouping", {
    override: 'Ext.grid.feature.Grouping',
    onGroupClick: function(view, rowElement, groupName, e) {
        var me = this,
            metaGroupCache = me.getCache(),
            groupIsCollapsed = !me.isExpanded(groupName),
            g;
        if (me.collapsible && !e.getTarget('.no-toggle')) {
            // CTRL means collapse all others.
            if (e.ctrlKey) {
                Ext.suspendLayouts();
                for (g in metaGroupCache) {
                    if (g === groupName) {
                        if (groupIsCollapsed) {
                            me.expand(groupName);
                        }
                    } else if (!metaGroupCache[g].isCollapsed) {
                        me.doCollapseExpand(true, g, false);
                    }
                }
                Ext.resumeLayouts(true);
                return;
            }
            if (groupIsCollapsed) {
                me.expand(groupName);
            } else {
                me.collapse(groupName);
            }
        }
    }
});