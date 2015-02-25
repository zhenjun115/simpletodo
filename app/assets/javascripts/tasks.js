"use strict";
var Todo = function ( conf ) {
	this.conf = $.extend( {
		/*pagination conf item*/
		page: 0,
		limit: 6, //default
		dataHtml: conf.dataHtml, 
		pagesHtml: conf.pagesHtml,
		nextSele: conf.nextSele,
		/**/
		newSele: conf.newSele,
		markSele: conf.markSele,
		filteSele: conf.filteSele
	}, conf );

	var _ = this;

	this.render = function ( data ) {

		var input;
		var span;
		var a;
		var li;
		var i, j;

		_.conf.dataHtml.empty();

		for( i in data.tasks ) {
			span = $ ( "<span></span>" ).html ( data.tasks[i].title ).attr("for", data.tasks[i].uuid);
			input = $ ( "<input type='checkbox' data-action='mark'>" )
					.attr( "data-id", data.tasks[i].uuid )
					.attr( "id", data.tasks[i].uuid );
			if( data.tags ){
				for( j in data.tags[i] ) {
					switch ( data.tags[i][j].name )
					{
						case "checked": input[0].checked=true;break;
						default:break;
					}
				}
			}
			li = $( "<li></li>" )
					.append ( input )
					.append ( span )
					.attr( "data-id", data.tasks[i].uuid );
			_.conf.dataHtml.append( li );
		}
		
		$("#" + _.conf.page).nextAll().remove();
		$("#" + _.conf.page).remove();
		for( i = 0; i < data.pages; i++ ) {
			a = $ ( "<a href='#' target='_self'> </a>" )
					.text (i + _.conf.page + 1)
					.attr("data-id", i + _.conf.page)
					.attr("data-action", "next")
					.attr("id", 'link' + (i + _.conf.page) );
			li = $ ( "<li></li>")
					.append ( a )
					.attr("id", _.conf.page + i) ;
			_.conf.pagesHtml.append ( li ) ;
		}

		$("#"+_.conf.page).find("a").addClass("active");
		$(_.conf.nextSele).unbind().bind( "click", _.next);
		$(_.conf.markSele).unbind().bind( "click", _.mark );
	};

	this.getData = function() {
		$.ajax( {
			url: "tasks/page",
			type: "get",
			dataType: "json",
			data: { page: _.conf.page, limit: _.conf.limit },
			success: function( data ){
				_.render( data ) ;
			},
			
			error: function(){

			}
		} );
	};

	this.next = function ( ) {
		$("#link"+_.conf.page).removeClass("active");
		_.conf.page = $(this).data("id");
		if( !$(this).data("id") ){
			_.conf.page = 0;
		}
		_.getData();
	};

	this.reset = function( data ) {
		_.conf.page = 0;
		_.render(data);
	};

	this.add = function () {
		var task = { title: $("#taskTitle").val() };
		$.ajax( {
			url: "/tasks/new",
			type: "get",
			dataType: "json",
			data: task,
			success: function ( data ) {
				_.reset( data );
			},
			error: function ( data ) {
			}
		} );
	};

	/*search*/
	this.filte = function () {
		var queryStr = $( this ).val ( );
		$.ajax( {
			url: "/tasks/filte",
			type: "get",
			dataType: "json",
			data: { title: queryStr },
			success: function ( data ) {
				if(data.length == 0){
					alert("nothing found");
				}else{
					_.reset(data);
				}
			},
			error: function ( data ) {
			}
		} );
	};

	/*todo other tags support, like: checked, working, unfinished ....*/
	
	this.mark = function ( ) {
		/*val1: [ checked, working, unfinished ....]*/
		var val1 = $( this )[0].checked ? "checked" : "";
		var data = { uuid: $( this ).data( "id" ), tag: val1 };

		$.ajax( {
			url: "/tasks/mark",
			type: "patch",
			dataType: "json",
			data: data,
			success: function ( data ) {
				$( this )[0].checked = data.checked
			},
			error: function ( data ) {
				console.log( data );
			}
		} );
	};

	this.checkbox = function( elem, checked ){
		elem[0].checked = checked;
	};

	this.init = function ( ) {

		_.conf.page = 0;
		_.conf.limit = 6;
		_.conf.dataHtml = $ ( _.conf.dataHtml ) ;
		_.conf.pagesHtml = $ ( _.conf.pagesHtml ) ;
		_.conf.nextSele = _.conf.nextSele;
		_.conf.markSele = _.conf.markSele;

		/*display 1st page tasks*/
		_.getData();

		_.conf.newSele = $( _.conf.newSele );
		_.conf.filteSele = $( _.conf.filteSele );

		_.conf.newSele.bind ( "click", _.add );
		_.conf.filteSele.bind ( "blur", _.filte );
		return _;
	};

	return _.init( );
};

