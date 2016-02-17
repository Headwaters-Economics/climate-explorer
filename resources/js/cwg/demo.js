var cwg = undefined;

$(document).ready(function() {

    function populate_variables(frequency) {
        var variables = climate_widget.variables(frequency);
        $("select#variable").empty();
        $(variables.map(function(v) {
            return ('<option value="' + v.id + '"' + '>'  + v.title + '</option>');
        }).join("")).appendTo($("select#variable"));
    }

    function update_frequency_ui() {
        var freq = $('#frequency').val();
        if (freq === "annual") {
            $('#timeperiod').attr("disabled", "true");
            $('label[for=timeperiod]').css("opacity", 0.5);
            $('#presentation').removeAttr("disabled");
            $('label[for=presentation]').css("opacity", 1.0);
        }
        if (freq === "monthly") {
            $('#timeperiod').removeAttr("disabled");
            $('label[for=timeperiod]').css("opacity", 1.0);
            $('#presentation').attr("disabled", "true");
            $('label[for=presentation]').css("opacity", 0.5);
        }
        if (freq === "seasonal") {
            $('#timeperiod').removeAttr("disabled");
            $('label[for=timeperiod]').css("opacity", 1.0);
            $('#presentation').attr("disabled", "true");
            $('label[for=presentation]').css("opacity", 0.5);
        }
        populate_variables(freq);
    }

    update_frequency_ui();

    $('#frequency').change(function() {
        update_frequency_ui();
        cwg.update({
            frequency: $('#frequency').val(),
            variable: $('#variable').val()
        });
    });

    $('#timeperiod').change(function() {
        cwg.update({
            timeperiod: $('#timeperiod').val()
        });
    });
    $('#county').change(function() {
        cwg.update({
            fips: $('#county').val()
        });
    });
    $('#variable').change(function() {
        cwg.update({
            variable: $('#variable').val()
        });
    });
    $('#scenario').change(function() {
        cwg.update({
            scenario: $('#scenario').val()
        });
    });
    $('#presentation').change(function() {
        cwg.update({
            presentation: $('#presentation').val()
        });
    });
    $('#median').change(function() {
        cwg.update({
            pmedian: $('#median').val()
        });
    });
    $('#range').change(function() {
        cwg.update({
            hrange: $('#range').val(),
            prange: $('#range').val()
        });
    });

    $('#download-button').click(function() {
        if (cwg) {
            var $ul = $('#download-panel').find('ul');
            $ul.empty();
            var dataurls = cwg.dataurls();
            if (dataurls.hist_obs) {
                $ul.append($("<li><a href='"+dataurls.hist_obs+"'>Observed Data</a></li>"));
            }
            if (dataurls.hist_mod) {
                $ul.append($("<li><a href='"+dataurls.hist_mod+"'>Historical Modeled Data</a></li>"));
            }
            if (dataurls.proj_mod) {
                $ul.append($("<li><a href='"+dataurls.proj_mod+"'>Projected Modeled Data</a></li>"));
            }
            $('#download-panel').removeClass("hidden");
        }
    });
    $('#download-dismiss-button').click(function() {
        $('#download-panel').addClass("hidden");
    });

    // download hook
    $('#download-image-link').click(function() {
      cwg.downloadImage(this, 'graph.png');
    });

    WebFont.load({
        google: {
            families: ['Pacifico', 'Roboto']
        },
        active: function() {
            cwg = climate_widget.graph({
                'div'           :  "div#widget",
                'dataprefix'    : 'http://climate-widget-data.nemac.org/data',
                'font'          : 'Roboto',
                'frequency'     : $('#frequency').val(),
                'timeperiod'    : $('#timeperiod').val(),
                'fips'          : $('#county').val(),
                'variable'      : $('#variable').val(),
                'scenario'      : $('#scenario').val(),
                'presentation'  : $('#presentation').val()
            });
        }
    });

});
