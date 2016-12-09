var fs = require( "fs" );

function random( min, max ) {
    return Math.random() * ( max - min ) + min;
}

function wiggle_char( char ) {
    var char_code = char.charCodeAt( 0 )
    var is_lower_letter = char_code >= 97 && char_code <= 122
    var is_upper_letter = char_code >= 65 && char_code <= 90
    var is_number = char_code >= 48 && char_code <= 57
    if ( is_lower_letter ) {
        return String.fromCharCode( random( 97, 122 ) );
    } else if ( is_upper_letter ) {
        return String.fromCharCode( random( 65, 90 ) );
    } else if ( is_number ) {
        return String.fromCharCode( random( 48, 57 ) );
    } else {
        return char
    }
}

function wiggle( json ) {
    var new_json = {}
    for ( var member in json ) {
        if ( json.hasOwnProperty( member ) ) {
            new_json[member] = ""
            for ( var i = 0; i < json[ member ].length; i++ ) {
                var char = json[ member ][ i ]
                var new_char = wiggle_char( char )
                new_json[member] += new_char
            }
        }
    }
    return new_json
}

function write( json, file_name ) {
    var json_string = JSON.stringify(json)
    fs.writeFile( file_name, json_string, function ( err ) {
        if ( err ) return console.error( err );
        console.log(file_name + " created")
    } )
}

var run = function () {
    var base_json_dir = process.argv[ 2 ]
    var json_count = process.argv[ 3 ]

    var base_json = JSON.parse( fs.readFileSync( base_json_dir, 'utf8' ) )
    if ( !fs.existsSync( "./sample_data" ) ) fs.mkdirSync( "./sample_data" )

    for ( var i = 0; i < json_count; i++ ) {
        var cur_json = _.clone( base_json )
        var new_json = wiggle( cur_json )
        write( new_json, "./sample_data/json_" + i + ".json" )
    }

}

run()
