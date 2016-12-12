var fs = require( "fs" );
var _ = require( 'underscore' );

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
            new_json[ member ] = ""
            for ( var i = 0; i < json[ member ].length; i++ ) {
                var char = json[ member ][ i ]
                var new_char = wiggle_char( char )
                new_json[ member ] += new_char
            }
        }
    }
    return new_json
}

function write( json, file_name ) {
    var json_string = JSON.stringify( json )
    fs.writeFileSync( file_name, json_string )
    console.log( file_name + " created" )
}

var run = function () {
    var base_json_dir = process.argv[ 2 ]
    var json_count = process.argv[ 3 ]
    var user_given_output = process.argv[ 4 ]

    if(!json_count) json_count = 1

    if ( user_given_output ) {
        var folder_name = user_given_output
    } else {
        var folder_name = "./sampleData_" + json_count + "count"
    }

    var base_json = JSON.parse( fs.readFileSync( base_json_dir, 'utf8' ) )

    if ( fs.existsSync( folder_name ) ) {
        var i = 1
        var og_folder_name = folder_name
        while ( fs.existsSync( folder_name ) ) {
            i++
            folder_name = og_folder_name + "_version" + i
        }
    }
    fs.mkdirSync( folder_name )

    for ( var i = 1; i <= json_count; i++ ) {
        var cur_json = _.clone( base_json )
        var new_json = wiggle( cur_json )
        write( new_json, folder_name + "/json_" + i + ".json" )
    }

}

run()
