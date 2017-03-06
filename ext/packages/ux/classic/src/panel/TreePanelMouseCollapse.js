Ext.define('Ext.ux.panel.TreePanelMouseCollapse', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treecollapse',
    getPlaceholder: function (direction) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            listeners = null,
            placeholder = me.placeholder,
            floatable = me.floatable,
            titleCollapse = me.titleCollapse;
        if (!placeholder) {
            if (floatable || (me.collapsible && titleCollapse)) {
                listeners = {
                    mouseenter: {
                        // titleCollapse needs to take precedence over floatable
                        fn: (!titleCollapse && floatable) ? me.floatCollapsedPanel : me.toggleCollapse,
                        element: 'el',
                        scope: me
                    }
                };
            }
            me.placeholder = placeholder = Ext.widget(me.createReExpander(collapseDir, {
                id: me.id + '-placeholder',
                listeners: listeners
            }));
        }
        // User created placeholder was passed in
        if (!placeholder.placeholderFor) {
            // Handle the case of a placeholder config
            if (!placeholder.isComponent) {
                me.placeholder = placeholder = me.lookupComponent(placeholder);
            }
            Ext.applyIf(placeholder, {
                margins: me.margins,
                placeholderFor: me
            });
            placeholder.addCls([Ext.baseCSSPrefix + 'region-collapsed-placeholder', Ext.baseCSSPrefix + 'region-collapsed-' + collapseDir + '-placeholder', me.collapsedCls]);
        }
        return placeholder;
    }
});