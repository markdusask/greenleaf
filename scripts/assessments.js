var todaysdate = new Date(),
    locale = "en-us";
todaysdate.setDate(todaysdate.getDate() - 1);
var StartYear = (todaysdate.getFullYear() - 1);
var EndYear = todaysdate.getFullYear();
var thislocation = getUrlParameters();
var hash = thislocation.location;
var searchterm = thislocation.searchterm;
var objhash = thislocation.objective;
var ay = thislocation.ay;
var html = "";

if (todaysdate.getMonth() > 6) {
    StartYear = StartYear + 1;
    EndYear = EndYear + 1;
}

if (typeof ay != 'undefined') {
    console.log(ay);
    var GivenDate = ay.split('-');
    StartYear = GivenDate[0];
    EndYear = GivenDate[1];
}


var applocation = window.location;
if (displaytype == "tincan") {

    workspacetarget = "html, body";
    applocation = window.parent.location;
    var applocationLauncherPage = $("#ltiSubmitForm input[name='custom_Xcustom_launcher_page_idX']", parent.document).val();
    if (typeof applocationLauncherPage == 'undefined') {
        console.log(applocation + " | " + applocationLauncherPage);
        NotAvailableError = '<h2 class="not-available-error">Start <a href="/community/ugmecurriculum">here</a></h2>';
        // window.location.href = "/community/ugmecurriculum";
    }
    var applocationDataSource = $("#ltiSubmitForm input[name='custom_Xcustom_source_file_idX']", parent.document).val();
    var applocationDataSourcePrev = $("#ltiSubmitForm input[name='custom_Xcustom_sourceprev_file_idX']", parent.document).val();
    var applocationPLOSource = $("#ltiSubmitForm input[name='custom_Xcustom_PLOsource_file_idX']", parent.document).val();
    var applocationSchedSource = $("#ltiSubmitForm input[name='custom_Xcustom_Schedsource_file_idX']", parent.document).val();
    var applocationAssessSource = $("#ltiSubmitForm input[name='custom_Xcustom_Assesssource_file_idX']", parent.document).val();

}


var monthtext = new Date();
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var AYselector = '<select name="AYselector" id="AYselector" class="AYselector"><option>' + (parseInt(StartYear) - 1) + '-' + (parseInt(EndYear) - 1) + '</option><option selected="selected">' + StartYear + '-' + EndYear + '</option><option>' + (parseInt(StartYear) + 1) + '-' + (parseInt(EndYear) + 1) + '</option></select>';
var NotAvailableError = '<h2 class="not-available-error">' + StartYear + '-' + EndYear + ' isn\'t available. Try another Academic Year: ' + AYselector + '</h2>';

function sortUL(selector) {
    var $ul = $(selector);
    $ul.find('li').sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
};

var items2 = [];
var unid = 1;

function tablesort() {
    $('#mainTable').tablesorter({
        // sort on the columns, order asc 
        sortList: [
            [1, 0],
            [0, 0]
        ],
        theme: 'default',
        widgets: ['zebra', 'filter', 'output'],
        widgetOptions: {
            zebra: ["normal-row", "alt-row"],
            output_dataAttrib: 'data-assesname',
            output_delivery: 'd',
            output_saveFileName: 'Assessments.csv',
            filter_searchFiltered: false,
            //filter_matchType : { 'input': 'match', 'select': 'match' },
            filter_columnFilters: true,
            filter_columnAnyMatch: true,
            //filter_saveFilters : true,
            //dateFormat : "yyyy-M-dd",
            filter_formatter: {
                0: function($cell, indx) { //https://mottie.github.io/tablesorter/docs/example-widget-filter-formatter-select2.html
                    return $.tablesorter.filterFormatter.select2($cell, indx, {
                        match: false, // adds "filter-match" to header
                        multiple: true,
                        cellText: '', // Cell text
                        width: '95%', // adjusted width to allow for cell text
                        value: [], // initial select2 values
                    });
                }
            }
        }
    });
}


function iterateObj(data) {
    //	html += "<ul class='lists'>";
    for (var item in data) {
        var classname = "list";
        var item2 = item;
        var thedate = data[item]['date'];
        var year = splitparts(data[item]['summary']);
        var parthtml = splitpartshtml(data[item]['summary']);
        var parthtmlmodule = splitpartshtmlmodule(data[item]['summary']);
        if (thedate != null) {
            var thedate = splitdate(thedate);
        } else {
            var thedate = "Pending";
        }
        html += "<tr><td data-assesname='" + data[item]['name'] + "'><a target='_blank' href='https://share.usask.ca/medicine/one45/kbase/Curriculum-Objectives.aspx#location=" + data[item]['id'] + "&ay=" + StartYear + '-' + EndYear + "'>" + data[item]['name'] + " <span class='elementid'> " + item + "</span></a><br/><a target='_blank' class='share sharelocation' href='https://share.usask.ca/medicine/one45/kbase/Curriculum-Objectives.aspx#location=" + data[item]['id'] + "&ay=" + StartYear + '-' + EndYear + "'>Objectives</a> <a target='_blank' class='share shareone45' href='https://one45.usask.ca/webeval/one.php?manager=sessionExplorer&id=" + data[item]['id'] + "'>Details</a></td><td><a target='_blank' href='https://one45.usask.ca/webeval/one.php?manager=sessionExplorer&id=" + data[item]['id'] + "'>" + thedate + "</a> </td><td>" + data[item]['activity_type'] + "</td><td>" + year + "</td><td>" + parthtml + "</td><td>" + parthtmlmodule + "</td></tr>\n";
    }
    //	html += "</ul>";
    return html;
}

var html = [];

function splitdate(thedate) {
    var paramsArray = thedate.split('T');
    return paramsArray[0];
}

function splitparts(year) {
    var paramsArray = year.split('::');
    return paramsArray[0];
    //    return year;	
}

function splitpartshtml(year) {
    var paramsArray = year.split('::');
    var parthtml = "<ul>";
    for (var i = 1; i < 2; i++) {
        var singleParam = paramsArray[i];
        parthtml += "<li>" + singleParam + "</li>";
    }
    parthtml += "</ul>";
    return parthtml;
    //	return year;
}

function splitpartshtmlmodule(year) {
    var paramsArray = year.split('::');
    var parthtml = "<ul>";
    for (var i = 2; i < paramsArray.length - 1; i++) {
        var singleParam = paramsArray[i];
        parthtml += "<li>" + singleParam + "</li>";
    }
    parthtml += "</ul>";
    return parthtml;
    //	return year;
}

function getUrlParameters() {
    var pageParamString = unescape(window.location.hash.substring(1));

    if (window.location != window.parent.location) {
        pageParamString = window.parent.location.search.substring(1);
        displaytype = "tincan";
    }

    var paramsArray = pageParamString.split('&');
    var paramsHash = {};

    for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split('=');
        paramsHash[singleParam[0]] = singleParam[1];
    }
    return paramsHash;
}

// ###### Start of AJAX ######
$(document).ready(function() {
    console.log("DOM loaded. Starting...");
    var showData = $('#toggle_all');
    var showLoading = $('#XXcontents');
    var loadingtext = 'Loading curriculum data...';

    var DataSource = 'https://share.usask.ca/medicine/one45/CurriculumJSON/assessments' + StartYear + '-' + EndYear + '.txt?' + todaysdate.getFullYear() + (todaysdate.getMonth() + 1) + todaysdate.getDate();

    if (displaytype == 'tincan') {
        var DataSource = applocationAssessSource;
        var PLOSource = applocationPLOSource;
        var SchedSource = applocationSchedSource;
        if (typeof ay != 'undefined') {
            // DataSource = applocationDataSourcePrev;
        }
        $(".box").remove();
        // $("#search").html('|');
    }

    jQuery.expr[':'].icontains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    // disable return key from submitting the form in Sharepoint
    $(document).keypress(
        function(event) {
            if (event.which == '13') {
                event.preventDefault();
                $('#search button').click();
            }


        });

    $('#search').hide();
    $('#toggle_all').text(loadingtext);
    //	$('#contents').html('<div style="text-align:center;width:100%;">Loading...<br/><img src="https://share.usask.ca/medicine/one45/SiteAssets/KBase/CurriculumObjectives/loading.gif" alt="Loading" title="Loading"></div>');

    $.getJSON(DataSource, function(data) {
        console.log(DataSource);
        console.log('Loaded curriculum data. Processing...');
        showData.text('Loaded curriculum data. Processing...');
        if (data.length == 0) {
            console.log('Empty Academic Year. Try using another one.');
            $('#contents').html(NotAvailableError);
        }

        data = iterateObj(data);

        showLoading.html('');
        $(data).appendTo("#mainTable tbody");

        data = null;
        tablesort();

        $(".accordion2").hide();


        /* 		$( "#contents" ).html(
        			$(".accordion").sort(function (a, b) {
        				return parseInt(a.id.replace(/^year_id_Year_(\d)$/gi, '$1')) - parseInt(b.id.replace(/^year_id_Year_(\d)$/gi, '$1'));
        			})
        		); */

        //Sort all the list items alphabetically		
        /* 		$(".parts").each(function() {
        			$(this).html(sortUL($(this)));
        		});	 */

        //		$('#search').show();

        $('ul > ul').hide();

        $('.totop').click(function() {
            console.log('ToTop');
            $('#s4-workspace').animate({
                scrollTop: $('#contents').offset().top - 100
            }, 300);
        });

        $('.accordion').click(function() {
            //ga('send', 'pageview', '/Curriculum-Objectives.aspx/ObjectivePart/' + $(this).attr("id"));									
            //$(this).next(".parts").toggle();
        });

        $('.part').click(function() {
            ga('send', 'pageview', '/Curriculum-Objectives.aspx/ObjectivePart/' + $(this).attr("id"));
            $(this).nextUntil(".part", ".objectives").slideToggle(200);
            $(this).nextUntil(".part", ".parts").slideToggle(200);
            $(this).toggleClass('opened');
        });

        $('.accordion .parts .part').click(function() {
            if ($(this).next(".objectives").length == 0) {
                if ($(this).next(".empty").length) {
                    $(this).next(".empty").remove();
                } else {
                    $('<li class="objective empty">No objectives</li>').insertAfter($(this));
                    $(this).addClass('opened');
                }
            }
        });

        $('#print-button').click(function() {
            window.print();
        });

        $('#excel-button').click(function() {
            $('#mainTable').trigger('outputTable');
        });

        $.fn.exists = function() {
            return this.length !== 0;
        }

        $('#search button').click(function() {
            var searchterm = $('#search input').val();
            window.location.href = 'https://share.usask.ca/medicine/one45/kbase/Curriculum-Objectives.aspx#searchterm=' + searchterm + '&ay=' + StartYear + '-' + EndYear;
            window.location.reload();
        });

        $('#toggle_all').remove();

        $('.sharefeedback').click(function() {
            var thisid = $(this).parent().attr("id");
            console.log('Shared feedback: ' + thisid);
            ga('send', 'event', 'Clicked', 'Feedback', thisid);
        });

        $('.shareone45').click(function() {
            var thisid = $(this).parent().attr("id");
            console.log('Opened One45: ' + thisid);
            ga('send', 'event', 'Clicked', 'One45', thisid);
        });

        $('.accordion2 > li.objective').toggle();
        $('#fetchdate, #notice-bar').html('All UGME Assessments for ' + AYselector + ' as of: ' + (monthShortNames[todaysdate.getMonth(todaysdate)]) + ' ' + (todaysdate.getDate(todaysdate)) + ', ' + (todaysdate.getFullYear(todaysdate)));
        showData.text('Expand all +');
        console.log('Ready');

        $('.AYselector').change(function() {
            console.log('Reloading new AY ' + this.value + '...');
            window.location.href = 'https://share.usask.ca/medicine/one45/kbase/Curriculum-Assessments.aspx#ay=' + this.value;
            window.location.reload();
        });

        $(showData).toggleClass('toggle_all');

        $('.accordion2').each(function() {
            if ($(this).find('li.objective').length == 0) {
                $(this).find('li.part').addClass('emptypart');
            }
        });


        $('.part-1').each(function() {
            var htmlstring = $(this).html();
            $(this).html('<span class="courseopen"></span>' + htmlstring);
        });


        // Automatically open the node and parent nodes if a location or objective is provided		
        if (typeof hash != 'undefined') {
            console.log('Location: ' + hash);
            ga('send', 'pageview', '/Curriculum-Objectives.aspx/ObjectivePart/' + hash);
            if (hash.indexOf('year_id_') === -1) {
                $('#' + hash).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                $('#' + hash).addClass('opened');
                $('#' + hash).addClass('highlight-yellow');
                $('#' + hash).click();
            }
            if (hash.indexOf('year_id_') !== -1) {
                $('#' + hash).children('.part').click();
            }
            $('#s4-workspace').animate({
                scrollTop: $('#' + hash).offset().top - 70
            }, 600);
        }
        if (typeof objhash != 'undefined') {
            console.log('Objective: ' + objhash);
            ga('send', 'pageview', '/Curriculum-Objectives.aspx/ObjectiveText/' + objhash);
            $('#' + objhash).parents().show();
            //$('#'+objhash).parents().find('li.objectives').addClass('opened');
            $('#' + objhash).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');

            $('#' + objhash).html(function() {
                return $(this).html().replace(new RegExp("Objective " + objhash, "ig"), "<span style='background-color: yellow;'>Objective " + objhash + "</span>");
            });

            $('#s4-workspace').animate({
                scrollTop: $('#' + objhash).offset().top - 70
            }, 600);
        }

        // Automatically search and open the node and parent nodes if a location or objective is searched		
        if (typeof searchterm != 'undefined') {
            $('#search input').val(searchterm);

            //			$(this).html('Searching...');
            var objectivesearchid = $('#search input').val();
            console.log('Objective Search: ' + objectivesearchid);
            ga('send', 'event', 'Search', 'Term', objectivesearchid);
            //			$( ".objective, .accordion2").hide();
            $("li.part, li.objective").removeClass('opened');

            if ($('#' + objectivesearchid).exists()) {
                console.log('Objective id: ' + objectivesearchid);
                $('#' + objectivesearchid).click();
                //				$('#'+objectivesearchid).parents('.accordion2').prevAll('.accordion:first').click();
                $('#' + objectivesearchid).parents().show();
                $('#' + objectivesearchid).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                $('#s4-workspace').animate({
                    scrollTop: $('#' + objectivesearchid).offset().top - 70
                }, 600);
            }
            if ($(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").exists()) {
                console.log('Objective or element text: ' + objectivesearchid);
                $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").html(function() {
                    return $(this).html().replace(new RegExp(objectivesearchid, "ig"), "<span style='background-color: yellow;'>" + objectivesearchid + "</span>");
                });
                $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                $(".objective:icontains(" + objectivesearchid + ")").closest('.objectives').show();
                $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent('.accordion').show();
                $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent().find('li.part, li.objective').show();
                $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent().find('li.part').addClass('opened');
            }
            if ($(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").length == 0 && $("#" + objectivesearchid).length == 0) {
                $('#search input').val('')
                $('#search input').attr('placeholder', 'Not found in this Academic Year.')
            }

            $(this).html('<i class="fa fa-search"></i>');

        }

    })


    .fail(function() {
        console.log('Can\'t find ' + DataSource);
        $('#contents').html(NotAvailableError);
        $('.AYselector').change(function() {
            console.log('Reloading new AY...');
            window.location.href = 'https://share.usask.ca/medicine/one45/kbase/Curriculum-Assessments.aspx#ay=' + this.value;
            window.location.reload();
        });

    });

});