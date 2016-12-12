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

function wiggle_word(input){
    var output = ""
    var input = input + ""
    for ( var i = 0; i < input.length; i++ ) {
        var char = input[ i ]
        var new_char = wiggle_char( char )
        output += new_char
    }
    return output
}

function wiggle_json( json ) {
    var new_json = {}
    var regex = new RegExp( '[0-9]{4}-[0-9]{2}-[0-9]{2}.*' )
    for ( var member in json ) {
        if ( json.hasOwnProperty( member ) ) {
            var is_date = regex.test( json[ member ] )
            var is_boolean = json[member] === true  || json[member] === false
            if ( ! (is_date || is_boolean)) {
                new_json[ member ] = wiggle_word(json[ member ])
            } else {
                new_json[ member ] = json[ member ]
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

    if ( !json_count ) json_count = 1

    if ( user_given_output ) {
        var folder_name = user_given_output
    } else {
        var folder_name = "./sample_" + json_count + "count"
    }

    var base_json = JSON.parse( fs.readFileSync( base_json_dir, 'utf8' ) )

    if ( fs.existsSync( folder_name ) ) {
        var i = 1
        var og_folder_name = folder_name
        while ( fs.existsSync( folder_name ) ) {
            i++
            folder_name = og_folder_name + "_v" + i
        }
    }
    fs.mkdirSync( folder_name )

    for ( var i = 1; i <= json_count; i++ ) {
        var cur_json = _.clone( base_json )
        var new_json = wiggle_json( cur_json )
        write( new_json, folder_name + "/json_" + i + ".json" )
    }

}

run()
