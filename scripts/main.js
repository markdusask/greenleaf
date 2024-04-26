var appversion = "Curriculum Viewer v4.0.0";
var todaysdate = new Date(),
    locale = "en-us";
todaysdate.setDate(todaysdate.getDate() - 1);
var StartYear = (todaysdate.getFullYear() - 1);
var EndYear = todaysdate.getFullYear();
var thislocation = getUrlParameters();
var hash = thislocation.location;
var searchterm = thislocation.searchterm;
var showmappings = thislocation.showmappings;
var showassess = thislocation.showassess;
var objhash = thislocation.objective;
var ay = thislocation.ay;
var timestamp = "a while ago.";
var html = "";
var PLOdata = "";
var sessionarray = [];
var namesarray = [];
var namesattached = false;

if (todaysdate.getMonth() > 4) {
    StartYear = StartYear + 1;

    EndYear = EndYear + 1;
}

if (typeof ay != 'undefined') {
    // console.log(ay);
    // var GivenDate = ay.split('-');
    // StartYear = GivenDate[0];
    // EndYear = GivenDate[1];
}

if (typeof displaytype !== 'undefined') {
    var displaytype = displaytype;
} else {
    var displaytype = "";
}

var workspacetarget = "#s4-workspace";
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
    var applocationDataSource = 'current.txt';
    var applocationDataSourcePrev = 'prev.txt';
    var applocationPLOSource = 'ugme_plos.txt';
    var applocationSchedSource = 'ugme-curriculum-schedule2022-2023.json.txt';

}

if (typeof hash != 'undefined') {
    if (hash.indexOf('display-assessments') !== -1) {
        window.location.href = "assessments.html";
    }
}

if (typeof hash != 'undefined') {
    if (hash.indexOf('display-plo') !== -1) {
        window.location.href = "plo.html";
    }
}



var monthtext = new Date();
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var InvalidCourseNum = '295635';
var InvalidCourseName = 'XMED';
var InvalidDataError = InvalidCourseName + " portfolio - error: \n###############\nThis list cannot be sorted at this time because " + InvalidCourseName + " isn't a year and doesn't contain a number for sequential sorting.";
var CheckValid = false;
var items2 = [];
var unid = 1;



function iterateObj(data) {
    html += "<ul class='parts'>";
    for (var item in data) {
        var classname = "part";
        var item2 = item;
        if (item == 'timestamp') {
            timestamp = data[item];
            break;
        }
        if ('part' in data[item] == false) {
            classname += " emptypart";
        }
        if (data[item]['itemname'].match(/^Year \d$/)) {
            var yearid = data[item]['itemname'].replace(/[^a-z0-9+]+/gi, '_');
            item2 = "year_id_" + yearid;
            //classname = "accordion";
            html += "</ul><ul class='parts accordion' id='" + item2 + "'>";
        }

        var coursesharebox = "";
        var startsonval = '<span class="starts_on" data-startson="' + data[item]["starts_on"] + '"> Starts: ' + data[item]["starts_on"] + ' | </span>';
        if (data[item]["starts_on"] == '' || data[item]["starts_on"] == null) {
            startsonval = '<span class="starts_on" data-startson="9999-99-99"></span>';
        }
        if (data[item]["type"] == 'Course') {
            startsonval = '<span class="starts_on" data-startson="0000-00-00"></span>';
            coursesharebox = "<a class='share shareassess_course' target='_blank' title='Prepare an assessment package for this course.'>Assess&nbsp;&raquo;</a> "
        }
        var URIEncodedName = encodeURIComponent(data[item]['itemname']);
        html += '<li class="' + classname + '" id="' + item + '" data-abbrev="' + data[item]["abbrev"] + '"><span class="partname">' + data[item]["itemname"] + '</span><br><div class="activitytype" data-activitytype="' + data[item]["type"] + '">' + startsonval + data[item]["type"] + '</div> <span class="elementid"> Id#:' + item + '</span>&nbsp;<div class="sharebox"><a class="share sharelocation" href="#location=' + item + '&ay=' + StartYear + '-' + EndYear + '" target="_blank" title="A direct link to this item which you can share or save.">Share&nbsp;&raquo;</a> <a class="share shareedit" href="https://share.usask.ca/medicine/ugme/curobj/Lists/CurChgReq/NewForm.aspx#part=' + item + '&name=' + URIEncodedName + '" target="_blank" title="Provide a change request for this item to the Curriculum Quality Review Sub-committee.">Edit&nbsp;»</a> <a class="share sharefeedback" href="mailto:medicine.ugme@usask.ca?subject=Curriculum Feedback&amp;body=Regarding the curriculum for:%20https://elentra.usask.ca/community/ugmecurriculum:explorer?location=' + item + '%26ay=' + StartYear + '-' + EndYear + '%0D%0A%0D%0A" target="_blank" title="Provide us with feedback about this curriculum item.">Feedback&nbsp;»</a> ' + coursesharebox + '<a class="share shareone45" href="https://one45.usask.ca/webeval/one.php?manager=courseExplorer&id=' + item + '" target="_blank" title="Open this item in the One45 curriculum explorer.">One45&nbsp;&raquo;</a></div>\n';
        if ('objectives' in data[item]) {
            html += '<ul class="objectives">';
            for (var objectives in data[item]['objectives']) {
                for (var objective in data[item]['objectives'][objectives]) {
                    var objPLOS = "";
                    for (var objPLOSitem in data[item]['objectives'][objectives][objective]) {
                        objPLOS += "<p class='plos plo' title='" + data[item]['objectives'][objectives][objective][objPLOSitem] + "'>" + swapPLOs(data[item]['objectives'][objectives][objective][objPLOSitem]) + "</p>";
                    }
                    objective = objective.replace(/(\r\n|\n|\r)/gm, "<br>");
                    html += '<li class="objective" id="' + objectives + '"><div class="objectiveid"><span class="objectivelabel">Objective</span> Id#: <span class="elementid">' + objectives + '</span><br class="preshare"><a class="share sharelink" href="#objective=' + objectives + '&ay=' + StartYear + '-' + EndYear + '" target="_blank" title="A direct link to this item which you can share or save.">Share&nbsp;&raquo;</a> <a class="share shareedit" href="https://share.usask.ca/medicine/ugme/curobj/Lists/CurChgReq/NewForm.aspx#part=' + item + '&name=' + URIEncodedName + '&objectiveid=' + encodeURIComponent(objectives) + '&objective=' + encodeURIComponent(objective) + '" target="_blank" title="Provide a change request for this item to the Curriculum Quality Review Sub-committee.">Edit&nbsp;»</a> <a class="share sharefeedback" href="mailto:medicine.ugme@usask.ca?subject=Curriculum Feedback&amp;body=Regarding the curriculum for:%20https://elentra.usask.ca/community/ugmecurriculum:explorer?location=' + objectives + '%26ay=' + StartYear + '-' + EndYear + '%0D%0A%0D%0A" target="_blank" title="Provide us with feedback about this curriculum item.">Feedback&nbsp;»</a>';
                    // Show the assessment button
                    if (data[item]["type"] != "Course") {
                        html += '<a class="share shareassess" title="Submit this objective for assessment.">Assess&nbsp;»</a>';
                    }
                    // End show the assessment button
                    html += '<a class="share shareassess_copy" title="Copy this objective for assessment.">Copy&nbsp;»</a></div><div class="objective_text"><p>' + objective + '</p><div class="plos plo-box"><p class="plos">Program Learning Objective(s): </p>' + objPLOS + '</div></div></li>\n';
                }
            }
            html += "</ul>";
        }
        if ('part' in data[item]) {
            //html += "</div>";
            iterateObj(data[item]['part']);
            //html += "</div>";
        } else {
            html += "</li>";
        }
    }
    html += "</ul>";
    return html;
}

var html = [];


function getUrlParameters() {

    var pageParamString = decodeURI(window.location.hash.substring(1));

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

function sortUL(selector) {
    if (CheckValid == true) {
        return;
    }
    var $ul = $(selector);
    $ul.children('.part').sort(function(a, b) {
        var upA = $(a).children('.partname').text().toUpperCase();
        var upB = $(b).children('.partname').text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
};

function sortULdates(selector) {
    if (CheckValid == true) {
        return;
    }
    var $ul = $(selector);
    $ul.children('.part').sort(function(a, b) {
        var upA = $(a).children('.activitytype').children('.starts_on').data('startson');
        var upB = $(b).children('.activitytype').children('.starts_on').data('startson');
        var thereturn = (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
        return thereturn;
    }).appendTo(selector);
};

function sortObjectives(selector) {
    var $ul = $(selector);
    $ul.children('.objective').sort(function(a, b) {
        var upA = $(a).children('.objective_text').text().toUpperCase();
        var upB = $(b).children('.objective_text').text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
};

function reformatPLOS(originallist) {
    var returnplo = [];
    for (var plos in originallist) {
        if (originallist[plos]['type'] == 'Mapping Element') {
            //console.log(originallist[plos]['']);
            if (originallist[plos]['parent']['type'] == 'Mapping Category') {
                var category = originallist[plos]['parent']['name'];
                category = category.substring(0, 3) + ":" + originallist[plos]['name'].substring(0, 2);
                category = category.toUpperCase();
            }
            returnplo[category] = originallist[plos]['parent']['name'] + ": " + originallist[plos]['name'];
        }
    }
    PLOdata = returnplo;
};

function swapPLOs(originalplo) {
    var plotext = null;
    for (var plo in PLOdata) {
        if (originalplo == plo) {
            plotext = PLOdata[plo];
        }
    }
    if (plotext == null) {
        plotext = "";
    }
    return plotext;
};

function findParentCourse(id) {
    var partname = $('#' + id).children('.partname').text();
    //	console.log('partname ' + partname);
    if (partname.search(/medc .{3}/ig) != -1) {
        return partname;
    }
    if (partname.search(/Year /ig) == -1) {
        var partid = $('#' + id).closest('.parts').closest('.part').attr('id');
        //		console.log("finding parent of " + partid);
        var partname = findParentCourse(partid);
        return partname;
    }
    return "NULL";
};




function alignPLO(selector, myid) {
    //Receive a PLO element(with parents), along with the part it belongs to.
    var plo = $(selector).attr('title');
    var plos = [];
    var parentplos;
    var objectiveid = $(selector).closest('.objective').attr('id');
    var objectivetxt = $(selector).closest('.objective').find('.objective_text').find('p').text().substr(0, 2);
    if (plo == "") {
        return "";
    } else {
        var parentid = $(selector).closest('.part').attr('id');
        // Let's look higher up to all parent courses to see if their objectives have our PLO.
        parentplos = getParentPLOs(parentid, plo);

        // Check if the parent course has an abbreviation. If it does then swap its id with its abbreviation				
        if ($(selector).closest('.part').parent().closest('.part').attr('data-abbrev') != 'undefined' && $(selector).closest('.part').parent().closest('.part').attr('data-abbrev') != '') {
            parentid = $(selector).closest('.part').parent().closest('.part').attr('data-abbrev');
        }

        plos.push(parentid + ":" + myid);
    }
    var returnplo = "";
    returnplo = stringifyPLO(parentplos, plos, plo, myid, objectiveid, objectivetxt);
    //	console.log(returnplo);
    return returnplo;
};



function stringifyPLO(parentplos, plos, plo, myid, objectiveid, objectivetxt, returnplo) {
    if (parentplos == undefined) {
        var parentplos = [];
    }
    if (returnplo == undefined) {
        var returnplo = "";
    }
    /* 
    some good places to validate in the 2018/19 AY are:

    Objective Id#: 1239204


    Objective Id#: 1239190


    Objective Id#: 1323706
    MED:01--PR:1241009,PR:1241011--227246:1241103--227312:1241299,227312:1241301--227468:1323706
    MED:14--PR:1241010,PR:1241011,PR:1241012--227246:1241103--227312:1241298,227312:1241301--227468:1323706

    Objective Id#: 1241637
    MED:01--PR:1241009,PR:1241011--227246:1241103--227312:1241299,227312:1241301--227412:1241637
    MED:14--PR:1241010,PR:1241011,PR:1241012--227246:1241103--227312:1241298,227312:1241301--227412:1241637



     */

    if (parentplos.length > 0) {
        var thisitem = "";
        for (var arrayitem in parentplos) {
            if (parentplos[arrayitem].length > 0) {
                thisitem += "<span>-" + parentplos[arrayitem] + "-</span>";
            } else {
                thisitem += "<span>-00-</span>";
            }
        }
        returnplo += "<tr><td><p><span>" + plo + "-</span>";
        returnplo += thisitem;
        //		returnplo += "<span>-" + plos + "-</span>";
        // It's not the best idea to use objectivetxt for the objective identifier, so use objectiveid
        returnplo += "<span>-" + myid + ":" + objectiveid + "</span></p></td></tr>";
    }
    return returnplo;
}

function looparray(myarray, preamble) {
    if (preamble == undefined) {
        preamble = "";
    }
    var mypreamble = preamble;
    var returnstring = "";
    for (var item in myarray) {
        if (Array.isArray(myarray[item])) {
            returnstring += looparray(myarray[item], mypreamble);
        } else {
            returnstring += "---" + myarray[item];
        }
    }
    return mypreamble + returnstring;
}

function getParentPLOs(parentid, partname) {
    var plos = [];
    var part = $('#' + parentid).parents('.part');
    part.each(function() {
        var partid = $(this).attr('id');
        // if an abbreviation exists, use that instead
        if ($(this).attr('data-abbrev') != 'undefined' && $(this).attr('data-abbrev') != '') {
            partid = $(this).attr('data-abbrev');
        }
        var ploparents = [];
        $(this).children(".objectives").find(".plo").each(function() {
            var ploname = $(this).attr('title');
            if (ploname.indexOf(partname) !== -1) {
                var id = $(this).closest('.objective').attr('id');
                // It's not the best idea to use idfromobjtxt for the objective identifier, so use id				
                // 				var idfromobjtxt = $(this).closest('.objective').find('.objective_text').find('p').text().substr(0, 2);
                ploparents.push(partid + ":" + id);
            } else {
                //ploparents.push("0000");
            }
        });
        plos.push(ploparents);
    });
    plos.pop();
    plos.reverse();
    return plos;
};

function togglePLOlink() {
    if ($("#ploShow").prop('checked')) {
        var value = $("#shareTextBox").val();
        $("#shareTextBox").val(value + "&showmappings=true");
        $('#shareTextBox').select();
        document.execCommand("copy");
    } else {
        var value = $("#shareTextBox").val();
        value = value.replace(/&showmappings=true/gi, '');
        $("#shareTextBox").val(value);
        $('#shareTextBox').select();
        document.execCommand("copy");
    }
};


function toggleAssesslink() {
    if ($("#assessrequest").prop('checked')) {
        var value = $("#shareTextBox").val();
        $("#shareTextBox").val(value + "&showassess=true");
        $('#shareTextBox').select();
        document.execCommand("copy");
    } else {
        var value = $("#shareTextBox").val();
        value = value.replace(/&showassess=true/gi, '');
        $("#shareTextBox").val(value);
        $('#shareTextBox').select();
        document.execCommand("copy");
    }
};


function checkXMED() {
    if ($('#' + InvalidCourseNum).length > 0 || $('#contents > .accordion > .part > .partname').text == InvalidCourseName) {
        // This might get patched https://jira.usask.ca/browse/ISD-354610
        if (CheckValid == true) {
            //alert(InvalidDataError);
            console.log(InvalidDataError);
        }
    }
}

function trylink() {
    console.log('Tried Link.');
    var href = $("#shareTextBox").val();
    window.open(href);
}


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
            type: "text/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, filename);
    } else {
        csvFile = new Blob([csv], { type: "text/csv" });

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    }
}

function attachNames(data) {
    if (namesattached == true) {
        return;
    }
    for (var item in data) {
        // console.log(data[item]['lastname']);
        for (var events in data[item]['event']) {
            // console.log(events);
            var id = data[item]['event'][events]['event_sessionid'];
            var name = Array.from(data[item]['firstname'])[0] + '. ' + data[item]['lastname'];
            var target = "#" + id + " > .partname";
            var sanstring = name.replace(/[^a-zA-Z0-9]/g, '');

            var myDivs = $(target + ' > .prefix');
            if (myDivs.length === 0) {
                myDivs = $('<span class="prefix">::</span>').appendTo(target);
            }

            $(target + ' > .prefix .' + sanstring).remove();
            $(target + ' > .prefix').append(' <span class="instname ' + sanstring + '">' + name + ';</span>');
            // if (sessionarray.indexOf(id) === -1) {
            //     // sessionarray[id] = [];
            //     sessionarray.splice(0, 0, [id]);
            // }
            // sessionarray.push([id]);
            // sessionarray[id] = [];
            // sessionarray[id][name] = name;
            // if (sessionarray[id].indexOf(name) === -1) {
            // sessionarray[id].push(name);
            // sessionarray[id].splice(0, 0, name);
            // console.log(id + ' + ' + name);
            // }
        }
    }

    // for (var events in sessionarray) {
    //     var person = " ";
    //     for (var people in sessionarray[events]) {
    //         person += sessionarray[events][people] + '; ';
    //         var target = "#" + events + " > .partname";
    //         // console.log(target);
    //     }
    //     $(target).append(' [' + person + ']');
    // }
    $(".aligned > .partname").each(function(q, elem) {
        let elements = $(elem).find(".instname");
        textArr = [];
        // elements.forEach(function(d, i) {
        //     if (textArr.indexOf(d.innerText) > -1) {
        //         d.remove();
        //     } else {
        //     }
        // });
    });
    namesattached = true;
    console.log("Attached names.");
}

function exportToCSV(item) {
    var csv = [];
    var rows = item[0].querySelectorAll(":scope > .parts > .part");
    var cols = item[0].querySelectorAll(":scope > .partname");
    var thetextc = cols[0].innerText.replace(/&nbsp;/gi, ' ');
    thetextc = thetextc.replace(/"/gi, '""');

    csv.push('"' + thetextc + '"');
    csv.push(',,,Midterm Exam I,,,,Midterm Exam II,,,,End of Module Exam,,,,Final Integrated Exam ,,,,Other,,OSCE,Supplementals');
    csv.push('Topic,Session-Level Learning Objectives,Objective ID,,,Results,Issues to Note,,,Results,Issues to Note,,,Results,Issues to Note,,,Results,Issues to Note,"Assignment, Group Work, Presentation",,,');

    for (var i = 0; i < rows.length; i++) {
        var row = [];

        var cols = rows[i].querySelectorAll(":scope > .partname");
        var thetexts = cols[0].innerText.replace(/&nbsp;/gi, ' ');
        thetexts = thetexts.replace(/"/gi, '""');

        var type = rows[i].querySelectorAll(":scope > .activitytype");
        var thetexttype = type[0].innerText.replace(/&nbsp;/gi, ' ');
        type = thetexttype.replace(/"/gi, '""');

        // console.log("type: " + type);
        if (type != "Course") {
            // console.log("course: " + thetextc);
            var starts = rows[i].querySelectorAll(":scope > .activitytype > .starts_on");
            var thetextstarts = starts[0].innerText.replace(/&nbsp;/gi, ' ');
            starts = thetextstarts.replace(/"/gi, '""');
            starts = starts.replace(/ /gi, '');
            starts = starts.replace(/\|/g, '');


            var objs = rows[i].querySelectorAll(":scope > .objectives > .objective");
            for (var j = 0; j < objs.length; j++) {
                var row = [];
                var cols2 = objs[j].querySelectorAll(":scope > .objective_text > p");
                var objectiveid = objs[j].querySelectorAll(":scope > .objectiveid > .hashobj");
                var one45id = objs[j].querySelectorAll(":scope > .objectiveid > .elementid");
                var objtext = cols2[0].innerText.replace(/&nbsp;/gi, ' ');
                objtext = objtext.replace(/"/gi, '""');
                if (j == 0) {
                    row.push('"' + thetexts + ' (' + starts + ')","' + objtext + '","' + objectiveid[0].innerText + ', ' + one45id[0].innerText + '"');
                } else {
                    // row.push(',"' + objtext + '"');
                    row.push('"' + thetexts + ' (' + starts + ')","' + objtext + '","' + objectiveid[0].innerText + ', ' + one45id[0].innerText + '"');
                }
                csv.push(row.join(","));
            }
        }
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), 'AssessmentPlanner ' + thetextc + '.csv');
}




// ###### Start of AJAX ######
$(document).ready(function() {
    console.log("DOM loaded. Starting " + appversion);
    var showData = $('#toggle_all');
    var showLoading = $('#contents');
    var loadingtext = 'Loading curriculum data...';

    if (displaytype != "tincan") {
        var DataSource = 'https://share.usask.ca/medicine/one45/CurriculumJSON/' + StartYear + '-' + EndYear + '.txt?' + todaysdate.getFullYear() + (todaysdate.getMonth() + 1) + todaysdate.getDate();
        var PLOSource = 'https://share.usask.ca/medicine/one45/CurriculumJSON/UGME_PLOs.txt';
    }

    if (displaytype == 'tincan') {
        var DataSource = applocationDataSource;
        var PLOSource = applocationPLOSource;
        var SchedSource = applocationSchedSource;
        var selectedTogglePrev = '';
        var selectedToggleCurrent = '';
        if (typeof ay == 'undefined') {
            if (todaysdate.getMonth() < 5) {
                ay = "prev";
                selectedTogglePrev = 'selected="selected"';
            } else {
                ay = "current";
                selectedToggleCurrent = 'selected="selected"';
            }
        }
        if (typeof ay != 'undefined') {
            if (ay == 'current') {
                DataSource = applocationDataSource;
                selectedToggleCurrent = 'selected="selected"';
            }
            if (ay == 'prev') {
                DataSource = applocationDataSourcePrev;
                selectedTogglePrev = 'selected="selected"';
                // StartYear = (parseInt(StartYear) - 1);
                // EndYear = (parseInt(EndYear) - 1);
            }
        }
        $(".box").remove();
        // $("#search").html('|');
    }
    var AYselector = '<select name="AYselector" id="AYselector" class="AYselector"><option value="prev" ' + selectedTogglePrev + '>' + StartYear + '-' + EndYear + '</option><option value="current" ' + selectedToggleCurrent + '>' + (parseInt(StartYear) + 1) + '-' + (parseInt(EndYear) + 1) + '</option></select>';
    var NotAvailableError = '<h2 class="not-available-error">' + StartYear + '-' + EndYear + ' isn\'t available. Try another Academic Year: ' + AYselector + '</h2>';

    jQuery.expr[':'].icontains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    // disable return key from submitting the form in Sharepoint
    $(document).keypress(
        function(event) {
            if (event.which == '13') {
                /* 			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                			$('#search button').click(); */
            }
        });



    // add the option to show/hide PLOs
    $('#headbar').append('<div class="togglePLObox"><label>Program Objectives: <input type="checkbox" name="ploToggle" id="ploToggle"></label></div>');
    $('#headbar').append('<div class="togglePLObox" onclick=\'$(".parts").not(".accordion").each(function(){$(this).html(sortUL($(this)));});\'>Sort A-Z</div><div class="togglePLObox" onclick=\'$(".parts").not(".accordion").each(function(){$(this).html(sortULdates($(this)));});\'>Sort Dates</div>');

    $('#search').hide();
    $('#toggle_all').text(loadingtext);


    //	$('#contents').prepend('<div class="loader"></div>');
    //	$('#contents').prepend('<div style="text-align:center;width:100%;"><img src="https://share.usask.ca/medicine/one45/SiteAssets/KBase/CurriculumObjectives/loading.gif" alt="Loading" title="Loading"></div>');

    $.ajax({
        async: true,
        url: PLOSource,
        dataType: 'json',
        success: function(data) {
            console.log(PLOSource);
            console.log('Loaded curriculum PLO data.');
            PLOdata = data;
            if (PLOdata.length == 0) {
                console.log('Empty PLOs. Try using another one.');
                $('#contents').html(NotAvailableError);
            } else {
                reformatPLOS(PLOdata);
            }
        }
    });

    $.getJSON(DataSource, function(data) {
        console.log(DataSource);
        console.log('Loaded curriculum data. Processing...');
        showData.text('Loaded curriculum data. Processing...');
        var keepgoing = true;
        if (data.length == 0) {
            console.log('Empty Academic Year. Try using another one.');
            $('#contents').html(NotAvailableError);
            keepgoing = false;
        }

        if (keepgoing == true) {
            data = iterateObj(data);
            showLoading.html('');
            $(data).appendTo("#contents");
            data = null;

            $("#contents").html(
                $(".accordion").sort(function(a, b) {
                    if (CheckValid == true) {
                        return;
                    }
                    return parseInt(a.id.replace(/^year_id_Year_(\d)$/gi, '$1')) - parseInt(b.id.replace(/^year_id_Year_(\d)$/gi, '$1'));
                })
            );

            // XMED
            checkXMED();

            //Sort all the list items alphabetically		
            $(".parts").not(".accordion").each(function() {
                $(this).html(sortUL($(this)));
                $(this).html(sortULdates($(this)));
            });

            $('#search').show();
        }

        $(".parts").not(".accordion").hide();

        $('.totop').click(function() {
            console.log('ToTop');
            $(workspacetarget).animate({
                scrollTop: $('#contents').offset().top - 100
            }, 300);
        });


        $('.part').click(function(event) {
            event.stopPropagation();
            gtag('send', 'pageview', '/ObjectivePart/' + $(this).attr("id"));
            $(this).children(".objectives").each(function() {
                $(this).html(sortObjectives($(this)));
            });
            //Assign PLO codes
            /* 
            Get the id of this part that part that was clicked.
            If the activitytype of this part is a session then we want to continue.
            Grab each objective of this part and add a heading to them all.
            Grab each PLO and give the PLO and its objective to the alignPLO function, along with the part they belong to. It'll return a string which will be added below the heading we just added above.
            */
            var myid = $(this).attr("id");

            /* use PLO codes */
            if ($(this).children(".activitytype").attr("data-activitytype") != "Course") {
                $(this).not(".aligned").children(".objectives").children(".objective").children(".objectiveid").each(function() {
                    $(this).append("<div class='plos plo-box'><p class='plos'>Program Learning Objective <a target=\"_blank\" href='https://wiki.usask.ca/x/coJGY'>alignment chain</a>:</p><table class='plos plo aligned'></table></div>");
                    var hashtext = $(this).closest('.objective').children('.objective_text').children('p').html();
                    var hashsess = $(this).closest('.part').children('.partname').html() + hashtext;
                    var hashcourse = $(this).closest(".parts > .part:not([data-abbrev='undefined']):not([data-abbrev=''])").data('abbrev');
                    if (hashcourse == null) {
                        hashcourse = 'NA';
                    }
                    $(this).children('.elementid').after(' <span class="hashobj">' + hashcourse + '-' + md5(hashsess) + '</span>');
                });
                $(this).not(".aligned").children(".objectives").find(".plo").not(".aligned").each(function() {
                    $(this).closest('.objective_text').siblings('.objectiveid').find("table").append(alignPLO($(this), myid));
                });
                $(this).addClass("aligned");
                if ($('#ploToggle').prop('checked')) {
                    $(".plos").show();
                }
            }

            /* end use PLO codes */

            $(this).children(".objectives").toggle();
            $(this).children(".parts").toggle();
            //$(this).children(".objectives").show();
            //$(this).children(".parts").show();			

            // Append level and courseid to Edit links
            $(this).children(".parts").children(".part").children(".sharebox").find(".shareedit").each(function() {
                var editactivitytype = $(this).closest('.part').children('.activitytype').attr("data-activitytype");
                if (editactivitytype != "Course") {
                    editactivitytype = "Session";
                } else {
                    var editactivitytype2 = "";
                    $(this).closest('.part').removeClass("emptypart");
                    editactivitytype2 = $(this).closest('.part').parent().closest('.part').children('.activitytype').attr("data-activitytype");
                    if (editactivitytype2 == "Course") {
                        editactivitytype = "Module";
                    }
                }
                var href = $(this).attr('href');
                var partid = $(this).closest('.part').attr('id');
                var coursename = encodeURIComponent(findParentCourse(partid));
                $(this).attr('href', href + '&level=' + editactivitytype + '&course=' + coursename);
            });
            $(this).children(".objectives").find(".shareedit").each(function() {
                var editactivitytype = $(this).closest('.part').children('.activitytype').attr("data-activitytype");
                if (editactivitytype != "Course") {
                    editactivitytype = "Session";
                } else {
                    var editactivitytype2 = "";
                    editactivitytype2 = $(this).closest('.part').parent().closest('.part').children('.activitytype').attr("data-activitytype");
                    if (editactivitytype2 == "Course") {
                        editactivitytype = "Module";
                    }
                }
                var href = $(this).attr('href');
                var partid = $(this).closest('.part').attr('id');
                var coursename = encodeURIComponent(findParentCourse(partid));
                $(this).attr('href', href + '&level=' + editactivitytype + '&course=' + coursename);
            });
            // End Append level and courseid to Edit links				

            $(this).toggleClass('opened');
        });

        $('.objectives, .elementid, .activitytype, .sharebox').click(function(event) {
            event.stopPropagation();
        });

        $('.accordion .parts .part').click(function() {
            if ($(this).children(".objectives").length == 0) {
                if ($(this).children(".empty").length) {
                    $(this).children(".empty").remove();
                } else {
                    $('<li class="objective empty">No objectives</li>').insertAfter($(this).children(".sharebox"));
                    $(this).addClass('opened');
                }
            }


        });

        $('#print-button').click(function() {
            window.print();
        });

        $('.clear-all').click(function() {
            $('body').append('<div class="overlay"><div class="overlay_content"><div><p style="margin-bottom:10px;">Are you sure you want to empty all items from this list?</p></div><div><span class="closeme" onclick="$(\'.assess-item-del\').each(function(){$(this).click();});$(this).parent().parent().parent().remove();$(\'.assessment_cart\').hide();">Empty</span><span class="closeme" onclick="$(this).parent().parent().parent().remove();">Cancel</span></div></div></div>');
            $('.overlay').fadeIn();
        });

        $(".plos").hide();
        $('#ploToggle').change(function() {
            if ($(this).prop('checked')) {
                $(".plos").show();
            } else {
                $(".plos").hide();
            }
        });

        $.fn.exists = function() {
            return this.length !== 0;
        }

        $('#search button').click(function() {
            var searchterm = $('#search input').val();
            window.open(window.location.protocol + '//' + window.location.hostname + window.location.pathname + '#searchterm=' + searchterm + '&ay=' + StartYear + '-' + EndYear);
            //			window.location.reload();
        });

        $('#toggle_all').click(function() {
            if (showData.text() == 'Close all –') {
                showData.text('Expand all +');
                $('.part').removeClass('opened');
                $('.objectives, .parts').hide();
                $('.accordion, .accordion > .part').show();
            } else {
                showData.text('Close all –');
                $('.part').addClass('opened');
                $('.part, .objectives, .parts').show();
            }
        });


        $('.sharefeedback').click(function() {
            var thisid = $(this).closest('.objective, .part').attr("id");
            console.log('Shared feedback: ' + thisid);
            gtag('send', 'event', 'Clicked', 'Feedback', thisid);
        });

        $('.shareone45').click(function() {
            var thisid = $(this).closest('.objective, .part').attr("id");
            console.log('Opened One45: ' + thisid);
            gtag('send', 'event', 'Clicked', 'One45', thisid);
        });

        $('.shareedit').click(function() {
            var thisid = $(this).closest('.objective, .part').attr("id");
            console.log('Make edits: ' + thisid);
            gtag('send', 'event', 'Editing', 'One45', thisid);
        });

        $('.shareassess_copy').click(function() {
            /* 			if ($('#ploToggle').prop('checked')) {
            			}
            			else {
            				$('#ploToggle').click();
            			} */
            var thisid = $(this).closest('.objective, .part').attr("id");
            var thisname = $(this).parent('.objectiveid').next('.objective_text').children('p').text();
            var thisplos = $(this).parent('.objectiveid').next('.objective_text').children('.plos').children('.plo');
            var thisplosstring = '';
            if (thisplos.length > 0) {
                thisplosstring += "<br>"
                thisplos.each(function(index) {
                    thisplosstring += $(this).attr('title');
                    if (index != thisplos.length - 1) {
                        thisplosstring += ", ";
                    } else {
                        thisplosstring += "";
                    };
                });
            };
            var sessionid = $(this).closest('.part').attr("id");
            var sessionname = $(this).closest('.part').children('.partname').text();
            var thecontents = sessionname + " (" + sessionid + ")\n" + thisname + " (" + thisid + ")" + thisplosstring;
            thecontents = thecontents.replace(/<br>/gi, '\n');
            thecontents += "\nQuestion (or ExamSoft question ID) to assess this objective:\n\n";
            console.log('Copy objective');
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = thecontents;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = { position: 'absolute', left: '-9999px' };
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
            $(this).after('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div>Copied to your clipboard!</div></div></div>');
            $('.overlay').fadeIn().delay(2000).fadeOut();
            setTimeout(function() {
                $('.overlay').remove();
            }, 4000);
            gtag('send', 'event', 'Clicked', 'AssessCopy');
        });

        $('.shareassess').click(function() {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            /* 			if ($('#ploToggle').prop('checked')) {
            			}
            			else {
            				$('#ploToggle').click();
            			} */
            var thisid = $(this).closest('.objective, .part').attr("id");
            var thisname = $(this).parent('.objectiveid').next('.objective_text').children('p').text();
            var thisplos = $(this).parent('.objectiveid').next('.objective_text').children('.plos').children('.plo');
            var thisplosstring = '';
            if (thisplos.length > 0) {
                thisplosstring += "<br>"
                thisplos.each(function(index) {
                    thisplosstring += $(this).attr('title');
                    if (index != thisplos.length - 1) {
                        thisplosstring += ", ";
                    } else {
                        thisplosstring += "";
                    };
                });
            };
            var sessionid = $(this).closest('.part').attr("id");
            var sessionname = $(this).closest('.part').children('.partname').text();
            var sessionlink = $(this).closest('.part').children('.sharebox').children('.sharelocation').attr("href");
            $('#' + thisid).css({ 'position': 'absolute' }).animate({ left: '-=3050px', top: '-=150px' }, "8000", "swing");
            $('.assessment_cart').show("slide");
            //			$('#search').hide();
            $('.submit1').text('Continue >');
            $('.assessment_cart .assess_items').append("<div class='assess-item cart-" + thisid + "'><span class='assess-item-del' onclick=\"$(this).parent().remove();$('#" + thisid + "').css({'position': 'static'})\">X</span> <a href='https://share.usask.ca/medicine/one45/kbase/Curriculum-Objectives.aspx" + sessionlink + "'>" + sessionname + " (" + sessionid + ")</a><br><b>" + thisname + " (" + thisid + ")</b>" + thisplosstring + "</div>");
            $('.cart-' + thisid).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            console.log('Assess: ' + thisid);
            gtag('send', 'event', 'Clicked', 'Assess', thisid);
        });

        $('.shareassess_course').click(function() {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            var thisid = $(this).closest('.objective, .part').attr("id");
            $(this).closest('.part').click();
            $(this).closest('.part').children('.parts').children('.part').each(function() {
                $(this).click();
            });

            var url1 = 'https://share.usask.ca/medicine/one45/CurriculumJSON/ugme-curriculum-schedule' + StartYear + '-' + EndYear + '.json.txt';
            if (displaytype == "tincan") {
                url1 = SchedSource;
            }
            $.ajax({
                async: false,
                url: url1,
                dataType: 'json',
                success: function(data) {
                    console.log('Loaded data: ' + url1);
                    namesarray = data;
                    attachNames(data);
                    if (data.length == 0) {
                        console.log('Empty.');
                    }
                }
            });

            exportToCSV($(this).closest('.part'));
            console.log('Assess: ' + thisid);
            gtag('send', 'event', 'Clicked', 'Assess_Course', thisid);
        });

        $('.submit_assessment_cart').on('click', '.submit1', function() {
            $('.copy1').show();
            $(this).addClass('finalize');
            $(this).removeClass('submit1');
            $(this).text('Submit >');
            $('.assessment_cart').addClass('assessment-cart-full');
            $('.assess-item').each(function(index) {
                if ($(this).find('.questionarea').length == 0) {
                    $(this).append('<br><span class="assess-questions">Question (or ExamSoft question ID) to assess this objective:</span><br><textarea oninput="$(this).html($(this).val());"class="questionarea" style="width:95%;" rows="3" cols="8"></textarea>');
                }
            });
            $('.assess-item textarea').first().focus();
            console.log('Finalize assessment cart');
        });

        $('.submit_assessment_cart').on('click', '.finalize', function() {
            //$(this).addClass('submit2');
            //			$('.finalize').removeClass('finalize');
            $('.finalize').text('Submit >');
            $('body').append('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div>Your Name: <input type="text" name="authorname" id="authorname"><br><br>Your Email: <input type="text" name="auth_email" id="auth_email"><br><br><input type="button" value="Submit" class="submit2"></div></div></div>');
            $('.overlay').fadeIn();
            console.log('Gather contact info.');
        });

        $('body').on('click', '.submit2', function() {
            var cartcontents1 = $('.assess-item');
            var cartcontents = cartcontents1.clone();
            var thecontents = '';
            cartcontents.each(function(index) {
                $(this).find('.assess-item-del').remove();
                var text2 = $(this).find('.questionarea').val().replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br>');
                $(this).find('.questionarea').remove();
                var text = $(this).html();
                //				text = text.replace(/<br>/gi, '%0D%0A');
                thecontents += text + text2 + '<br><br><br>';
            });
            console.log('Submit assessment cart');
            //			var auth_email = 'test@example.com';
            //			var authorname = 'test';
            var auth_email = $('#auth_email').val();
            var authorname = $('#authorname').val();
            var thecontents = encodeURIComponent(thecontents);
            var submiturl = 'https://medic.usask.ca/manage/ugme-curric-assess/assess.php?token=wruktyb2ny5y1udinx1oyaf6ay4378bcxdg3talxtkac7cnt7qytgtnytyby1udinx1oyaf6ay4378bcxdg3talxt&email=' + auth_email + '&message=' + thecontents + '&author=' + authorname;
            $.ajax({
                async: true,
                method: "POST",
                type: "POST",
                url: submiturl,
                dataType: 'jsonp',
                statusCode: {
                    200: function() {
                        console.log('Submitted.');
                        $('.overlay').remove();
                        //						$('.assess-item').remove();
                        //						$('.assessment_cart').hide();
                        $('body').append('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div><h3>Submitted successfully to the USask UGME office.</h3></div></div></div>');
                        $('.overlay').fadeIn();
                        $('.finalize').addClass('submit1');
                        $('.finalize').text('Continue >');
                        $('.finalize').removeClass('finalize submit2');
                        //$('.copy1').hide();
                        $('.assessment_cart').removeClass('assessment-cart-full');
                    }
                }
            });
            gtag('send', 'event', 'Clicked', 'AssessSubmit');
        });

        //$('.copy1').hide();

        $('.submit_assessment_cart .copy1').click(function() {
            var cartcontents1 = $('.assess-item');
            var cartcontents = cartcontents1.clone();
            var thecontents = '';
            cartcontents.each(function(index) {
                $(this).find('.assess-item-del').remove();
                var text = $(this).html();
                var text2 = $(this).find('.questionarea').val();
                $(this).find('.questionarea').remove();
                var text = $(this).html();
                text = text.replace(/<br>/gi, '\n');
                text = text.replace(/<b>/gi, '');
                text = text.replace(/<\/b>/gi, '');
                text = text.replace(/<span class="assess-questions">/gi, '');
                text = text.replace(/<\/span>/gi, '');
                thecontents += text + text2 + '\n\n\n';
            });
            console.log('Copy assessment cart');
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = thecontents;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = { position: 'absolute', left: '-9999px' };
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
            $('body').append('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div><span>Copied to your clipboard!</span></div></div>');
            $('.overlay').fadeIn();
            gtag('send', 'event', 'Clicked', 'AssessCopy');
        });

        $('.sharelocation, .sharelink').click(function(event) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            $('.overlay').remove();
            var thisid = $(this).closest('.objective, .part').attr("id");
            var href = applocation.protocol + '//' + applocation.hostname + applocation.pathname + $(this).attr("href");
            if (displaytype == "tincan") {
                href = href.replace("#", "?");
            }
            $(this).after('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div><label>Include Program Learning Objectives: <input type="checkbox" name="ploShow" id="ploShow" onchange="togglePLOlink();"></label><br><label>Request Assessment Package: <input type="checkbox" name="assessrequest" id="assessrequest" onchange="toggleAssesslink();"></label></div><input id="shareTextBox" value="' + href + '" readonly><br><a id="trylink" onclick="trylink(); return false;">Try link ></a><br><span class="clipboardnotice">Copied to your clipboard!</span></div></div>');
            $('.overlay').fadeIn();
            $('#shareTextBox').select();
            document.execCommand("copy");
            console.log('Shared Link: ' + thisid);
            gtag('send', 'event', 'Clicked', 'Link', thisid);
        });

        var assessment_cart_open = true;
        var toggler = $('.assessment_cart .toggle');
        toggler.text("");
        $('.assessment_cart .toggle').click(function(element) {
            if (assessment_cart_open == true) {
                //$('.copy1').hide();
                $('.finalize').addClass('submit1');
                $('.finalize').removeClass('finalize');
                $('.submit1').text('Continue >');
                $('.assessment_cart').removeClass('assessment-cart-full');
                $('.assessment_cart').animate({ left: '-205px' });
                toggler.text("");
                assessment_cart_open = false;
            } else {
                $('.assessment_cart').animate({ left: '0px' });
                toggler.text("");
                assessment_cart_open = true;
            }
        });

        $('.closeme').click(function() {
            $(this).parent().parent().remove();
        });

        $('#fetchdate, #notice-bar').html('For ' + AYselector + ' as of: ' + timestamp);
        showData.text('Expand all +');
        console.log('Ready!');

        $('.AYselector').change(function() {
            console.log('Reloading new AY...');
            window.parent.location.href = '/#ay=' + this.value;
            // window.parent.location.reload();
        });

        $(showData).toggleClass('toggle_all');

        var localstore = localStorage.getItem('assessmentcart');
        if (localstore != null && localstore.length > 14) {
            $('.assess_items').html(localstore);
            $('.assess_items textarea').each(function() {
                var contents = $(this).html();
                $(this).val(contents);
            });
            $('.assessment_cart').show("slide");
            console.log('Assessment cart loaded.');
        }

        var mutationObserver = new MutationObserver(function(mutations) {
            localStorage.setItem('assessmentcart', $('.assess_items').html());
            console.log('Assessment cart saved.');
        });

        // Starts listening for changes in the root HTML element of the page.
        var elementtoob = $(".assess_items")[0];
        mutationObserver.observe(elementtoob, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });




        // Automatically show objectives if that paramater has been provided
        if (typeof showmappings != 'undefined') {
            console.log('Showing mappings');
            $('#ploToggle').click();
        }


        // Automatically open the node and parent nodes if a location or objective is provided		
        if (typeof hash != 'undefined') {
            console.log('Location: ' + hash);
            gtag('send', 'pageview', '/ObjectivePart/' + hash);
            if (hash.indexOf('year_id_') === -1) {
                $('#' + hash).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                $('#' + hash).addClass('highlight-yellow');
                $('#' + hash).find('.parts').addClass('highlight-yellow');
                $('#' + hash).click();
                $('#' + hash).addClass('opened');
            }
            if (hash.indexOf('year_id_') !== -1) {
                $('#' + hash).children('.part').click();
            }
            if (typeof showassess != 'undefined') {
                $(workspacetarget).animate({
                    scrollTop: $('#' + hash + ' .parts').offset().top - 70
                }, 1);
            } else {
                $(workspacetarget).animate({
                    scrollTop: $('#' + hash).offset().top - 70
                }, 1);
            }
        }
        if (typeof objhash != 'undefined') {
            console.log('Objective: ' + objhash);
            gtag('send', 'pageview', '/ObjectiveText/' + objhash);
            $('#' + objhash).parents().click();
            //$('#'+objhash).parents().find('li.objectives').addClass('opened');
            $('#' + objhash).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');

            $('#' + objhash).css("background-color", "yellow");

            $(workspacetarget).animate({
                scrollTop: $('#' + objhash).offset().top - 70
            }, 600);
        }


        // Automatically show assesment instructions if that paramater has been provided
        if (typeof showassess != 'undefined') {
            $('body').append('<div class="overlay"><div class="overlay_content"><span class="closeme" onclick="$(this).parent().parent().remove();">Close</span><div><h1>Prepare an Assessment</h1><p>You are being asked to prepare an assessment package. The steps are:<div style="margin: auto; display: table;"><ol style="text-align: left;"><li>Open a Session to view its objectives. Sessions are labeled with a leaf <img width="20px" src="leaf.png"></li><li>Pick the objectives you want to assess using the <span class="share">Assess</span> button.</li><li>Pick more sessions and objectives as desired.</li><li>Add questions to assess each objective.</li><li>Submit the package of objectives and questions to the UGME office.</li></ol></div>To begin, open a session <img width="20px" src="leaf.png"> and select the <span class="share">Assess</span> button next to one of its objectives:<br></p><p><span class="trylink" onclick="$(\'.overlay\').remove();">Start ></span></p><br><img style="box-shadow: 0px 0px 15px;width: 100%;max-width: 852px;" src="how-to-anim.gif"></div></p></div></div>');
            console.log('Showing assessment dialog');
            $('.overlay').fadeIn();
            $('body').addClass('showassess');
        }



        // Automatically search and open the node and parent nodes if a location or objective is searched		
        if (typeof searchterm != 'undefined') {
            $('#search input').val(searchterm);

            //			$(this).html('Searching...');
            var objectivesearchid = $('#search input').val();
            var searchresults = false;
            console.log('Objective Search: ' + objectivesearchid);
            gtag('send', 'event', 'Search', 'Term', objectivesearchid);
            $("li.part, li.objective").removeClass('opened');

            if ($('#' + objectivesearchid).exists()) {
                console.log('Objective id: ' + objectivesearchid);
                searchresults = true;
                $('#' + objectivesearchid).click();
                $('#' + objectivesearchid).parents().show();
                $('#' + objectivesearchid).parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                $(workspacetarget).animate({
                    scrollTop: $('#' + objectivesearchid).offset().top - 70
                }, 600);
            } else {
                if ($(".part:icontains(" + objectivesearchid + ")").exists()) {
                    // if ($( ".objective:icontains("+objectivesearchid+"), .part:icontains("+objectivesearchid+")" ).exists()) {				
                    console.log('Objective or element text: ' + objectivesearchid);
                    searchresults = true;
                    $(".objective:icontains(" + objectivesearchid + "), .partname:icontains(" + objectivesearchid + "), .elementid:icontains(" + objectivesearchid + ")").html(function() {
                        return $(this).html().replace(new RegExp(objectivesearchid, "ig"), "<span style='background-color: yellow;'>" + objectivesearchid + "</span>");
                    });
                    $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parents('.parts').show().prev('.objectives').show().prev('.part').addClass('opened');
                    $(".objective:icontains(" + objectivesearchid + ")").closest('.objectives').show();
                    $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent('.accordion').show();
                    $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent().find('li.part, li.objective').show();
                    $(".objective:icontains(" + objectivesearchid + "), .part:icontains(" + objectivesearchid + ")").parent().find('li.part').addClass('opened');
                    $(workspacetarget).animate({
                        scrollTop: $("#" + objectivesearchid + ", .part:icontains(" + objectivesearchid + ")").last().offset().top - 70
                    }, 600);
                }
            }
            if (searchresults == true) {
                // if ($( ".objective:icontains("+objectivesearchid+"), .part:icontains("+objectivesearchid+")" ).length == 0 && $( "#"+objectivesearchid).length == 0) {
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
            window.location.href = 'https://elentra.usask.ca/community/ugmecurriculum:explorer?ay=' + this.value;
            window.location.reload();
        });
    });
});