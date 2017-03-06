/**
 * Created by Tom on 9/29/2014.
 */
Ext.define('Ext.ux.Export', {
    extend: 'Ext.Component',
    alias: 'widget.uxexport',
    autoEl: {tag: 'iframe', cls: 'x-hidden', src: Ext.SSL_SECURE_URL},
    load: function (config) {
        this.getEl().dom.src = config.url + (config.params ? '?' + Ext.urlEncode(config.params) : '');
    }
});

