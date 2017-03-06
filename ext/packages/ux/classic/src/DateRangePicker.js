Ext.define('Ext.ux.DateRangePicker', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.daterangepicker',

    requires: [
        'Ext.form.trigger.Trigger',
        'Ext.picker.Date',
        'Ext.form.field.Time'
    ],
    triggers: {
        mytrigger: {
            weight: 0,
            cls: 'date-range-picker',
            handler: 'onShowPicker',
            scope: 'this'
        }
    },
    initComponent: function () {
        var me = this;
        //component default configurations
        var defaults =
        {
            selectedStart: null,
            selectedEnd: null,
            dateFormat: 'm/d/Y',
            showButtonTip: true,
            showTimePickers: false,
            timePickerFromValue: null,
            timePickerToValue: null,
            timeFormat: 'H:i:s',
            timePickersEditable: false,
            timeIncrement: 5,
            timePickersQueryDelay: 500,
            timePickersWidth: 100,
            confirmBtnText: 'Set Range',
            presets: [],
            diffPreciseUnits: null
        };
        //merge the defaults with the instance configurations if any
        me.pickerDefaults = me.pickerDefaults ? Ext.apply(defaults, me.pickerDefaults) : defaults;
        //check for invalid time formats and set them to defaults
        /*
        if (me.drpDefaults.showTimePickers && (Ext.Date.parse(me.drpDefaults.timePickerFromValue, me.drpDefaults.timeFormat) == null || Ext.Date.parse(me.drpDefaults.timePickerToValue, me.drpDefaults.timeFormat) == null)) {
            me.drpDefaults.timePickerFromValue = null;
            me.drpDefaults.timePickerToValue = null;
            me.drpDefaults.timeFormat = 'H:i:s';
        }
        */
        me.callParent();
    },

    beforeRender: function() {
        var me = this;
        me.presetStore = new Ext.data.JsonStore({
            storeId: 'due',
            data: me.pickerDefaults.presets,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'array'
                }
            },
            fields: [
                {
                    name: 'preset'
                }
            ]
        });
        me.callParent();
    },
    onShowPicker: function() {
        var me = this,
            picker = Ext.create('Ext.window.Window', {
            reference: 'daterangepicker',
            border: false,
            layout: 'hbox',
            title: 'Select Date Range',
            items: [
                {
                    xtype: 'container',
                    drpItemRole: 'containerFrom',
                    layout: {
                        type: 'vbox',
                        align: 'left'
                    },
                    items: [
                        {
                            xtype: 'datepicker',
                            drpItemRole: 'pickFrom',
                            listeners: {
                                select: function (picker, date) {
                                    me.setRange(picker);
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    drpItemRole: 'containerTo',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    items: [
                        {
                            xtype: 'datepicker',
                            drpItemRole: 'pickTo',
                            listeners: {
                                select: function (picker, date) {
                                    me.setRange(picker);
                                }
                            }
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                         xtype: 'tbfill'
                     },
                     {
                         xtype: 'combobox',
                         fieldLabel: 'Preset',
                         labelWidth: 50,
                         displayField: 'preset',
                         queryMode: 'local',
                         store: me.presetStore,
                         valueField: 'preset',
                         listeners: {
                             select: function (combo, record, eOpts) {
                                 me.setPreset(combo, record.get('preset'));
                             }
                         }
                     },
                     {
                         xtype: 'button',
                         cls: 'toolbar-button',
                         overCls: 'toolbar-button-over',
                         text: 'Confirm',
                         listeners: {
                             click: function (button, e, eOpts) {
                                 picker.close();
                             }
                         }
                     }
                    ]
                }
            ]
        });
        picker.show();
    },
    setRange: function (picker) {
        var me = this,
        drpConfig = me.pickerDefaults,
        win = picker.up('window'),
        dFrom = Ext.Date.format(win.down('datepicker[drpItemRole=pickFrom]').getValue(), drpConfig.dateFormat),
        dTo = Ext.Date.format(win.down('datepicker[drpItemRole=pickTo]').getValue(), drpConfig.dateFormat);
        me.setValue(dFrom + ' - ' + dTo);
    },
    setPreset: function (combo, preset) {
        var me = this,
            win = combo.up('window'),
            pickerFrom = win.down('datepicker[drpItemRole=pickFrom]'),
            pickerTo = win.down('datepicker[drpItemRole=pickTo]'),
            dt = new Date(), diff, Year, Month, newDate, toDate;
        me.setValue(preset);

        switch (preset) {
            case 'Previous 12 Months':
                diff = (dt.getDay() + 6) % 7; // Number of days to subtract
                var lastMonday = new Date(dt - diff * 24 * 60 * 60 * 1000); // Do the subtraction
                pickerFrom.setValue(lastMonday);
                pickerTo.setValue(new Date());
                //pickerTo.selectToday();
                break;
            case 'Last Three Months':
                newDate = dt.setMonth(dt.getMonth() - 3);
                pickerFrom.setValue(new Date(newDate));
                pickerTo.setValue(new Date());
                break;
            case 'Month To Date':
                pickerFrom.setValue(Ext.Date.getFirstDateOfMonth(dt));
                pickerTo.setValue(new Date());
               // pickerTo.selectToday();
                break;
            case 'Previous Month':
                Year = dt.getFullYear();
                Month = dt.getMonth(); //Month is ZERO-based!!!
                //Ext.Date.parse uses 1-based month numbers, so if we receive 0(January) for the Month, then we must set Month to 12 and decrease Year with 1
                //in order to produce the previous month
                if (Month == 0) {
                    Month = 12;
                    Year = Year - 1;
                }
                Month = Month < 10 ? '0' + Month : Month;
                newDate = Ext.Date.parse(Year + '-' + Month + '-01', 'Y-m-d');
                pickerFrom.setValue(newDate);
                pickerTo.setValue(Ext.Date.getLastDateOfMonth(newDate));
                break;
            case 'Year to Date':
                Year = dt.getFullYear();
                newDate = Ext.Date.parse(Year + '-01-01', 'Y-m-d');
                pickerFrom.setValue(newDate);
                pickerTo.setValue(new Date());
                break;
            default:
                return;
        }
        //me.setRange(combo);
    },
    beforeDestroy: function() {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.picker
            );
        }
        me.callParent();
    }

});