var Transformer = require( './transformer.js' );

function MuglHelper( options ) {
    this.options = options;
}

MuglHelper.prototype.postJson = function (url, data, callback){
        //stringify objects
        if ((typeof data === 'function') || (typeof data === 'object')){
            data = JSON.stringify(data);
        }

        return $.ajax({
            url: url,
            type: "POST",
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            data: data,
            success: callback
        });
    };


MuglHelper.prototype.getDataRequests = function ( type, id ) {
    var payload = {
        requests: [],
        data: []
    };

    if (type === 'TEMP') {
        //observed
        payload.requests.push(
            this.postJson(this.options.ACISStnDataUrl,
                {
                    sid: id,
                    sdate: "por",
                    edate: "por",
                    elems: [{name: "mint", prec: 1}, {name: "maxt", prec: 1}]
                }, function ( r ) {
                    payload.data['TEMP'] = '';
                    $.each(r.data, function ( i, ln ) {
                        //dump missing values
                        if (ln.indexOf('M') !== -1) {
                            return;
                        }
                        //remove dashes from dates
                        ln[0] = ln[0].replace(/-/g, '');

                        payload.data['TEMP'] += ln.join(',') + '\n';
                    });
                }));
        //normals
        payload.requests.push(this.postJson(this.options.ACISStnDataUrl,
            {
                sid: id,
                sdate: "2015-1-1",
                edate: "2015-12-31",
                elems: [{name: "mint", normal: "1", prec: 1}, {name: "maxt", normal: "1", prec: 1}]
            },
            function ( r ) {
                payload.data['TEMP_NORMAL'] = '';
                $.each(r.data, function ( i, ln ) {
                    //dump missing values
                    if (ln.indexOf('M') !== -1) {
                        return;
                    }
                    //remove dashes from dates
                    ln[0] = ln[0].replace(/-/g, '');
                    payload.data['TEMP_NORMAL'] += ln.join(',') + '\n';
                });
            }));
    }

    return payload;
};

MuglHelper.prototype.buildMugl = function( data, type, summary, templates ) {
    var d = new Date();
    var max = $.datepicker.formatDate( 'yymmdd', d );
    d.setFullYear( d.getFullYear() -1 );
    var min = $.datepicker.formatDate( 'yymmdd', d );

    return Mustache.render(templates['mugl'], {
        marginleft: 40,
        mindate: min,
        maxdate: max,
        verticalaxes: this.buildVerticalAxisSection( type, 0, templates ),
        plots: this.buildPlotSection( type, templates ),
        datas: this.buildDataSection( type, data, templates )
    });
};

MuglHelper.prototype.buildVerticalAxisSection = function( type, position, templates ) {
    var template;
    switch ( type ) {
        case 'TEMP' :
            template = templates['vertical-axis-temp'];
            break;
        case 'PRCP_YTD' :
            template = templates['vertical-axis-ytd-prcp'];
            break;
    }

    return Mustache.render( template, {
        position: position
    });

};

MuglHelper.prototype.buildPlotSection = function( type, templates ) {
    var plots = [];
    switch ( type ) {
        case 'TEMP' :
            plots.push( Mustache.render( templates['plot-normal-temp'] ) );
            plots.push( Mustache.render( templates['plot-temp'] ) );
            break;
        case 'PRCP_YTD' :
            plots.push( Mustache.render( templates['plot-normal-ytd-prcp'] ) );
            plots.push( Mustache.render( templates['plot-ytd-prcp'] ) );
            break;
    }

    return plots.join( '' );
};

MuglHelper.prototype.buildDataSection = function( type, payload, templates ) {
    var normals = [];
    var normalTemplate;
    var data = [];
    var dataTemplate;

    if ( type === 'TEMP' ) {
        // normals        
        normals = Transformer.transformCSV(
                payload['TEMP_NORMAL'],
                Transformer.transformations[type + '_NORMAL'] );

        normalTemplate = templates['data-normal-temp'];

        // data
        data = Transformer.transformCSV(
                payload['TEMP'],
                Transformer.transformations[type] );

        dataTemplate = templates['data-temp'];

    } else {
        // normals
        normals = Transformer.transformCSV(
                payload[type + '_NORMAL'],
                Transformer.transformations[type + '_NORMAL'] );

        data = Transformer.transformCSV(
                payload[type],
                Transformer.transformations[type] );

        switch ( type ) {
            case 'PRCP_YTD' :
                normalTemplate = templates['data-normal-ytd-prcp'];
                dataTemplate = templates['data-ytd-prcp'];
                break
        }
    }

    var section = [];

    if ( normals.length !== 0 ) {
        section.push(Mustache.render( normalTemplate, {
            values: normals
        }));
    }

    section.push(Mustache.render( dataTemplate, {
        values: data
    }));

    return section.join( '' );
};

// TODO: follow class with prototype

module.exports = {
    MuglHelper: MuglHelper
}
