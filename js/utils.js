function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function scrub(sourceText, valueToScrub){
    newTextValue = "";
    
    if(sourceText.length > 0){
        scrubIndex = sourceText.indexOf(valueToScrub);
        
        newTextValue = sourceText.substr(0, scrubIndex);
        newTextValue = newTextValue + sourceText.substr(scrubIndex + valueToScrub.length);
    }
    return newTextValue;
}

function htmlDecode(sValue){
    res = sValue
    if (sValue != null && sValue != ""){
        res = res.replace(/&quot;/g,'\"');
        res = res.replace(/&gt;/g,'>');
        res = res.replace(/&lt;/g,'<');
    }
    return res;
}

function textAreaFunc(textAreaWhitelist){
    var textAreas = Array.prototype.slice.call(document.getElementsByTagName("textarea"));
    
    if(textAreas != null){
        textAreas.forEach(function(item){
            
            if(!textAreaWhitelist.includes(item.getAttribute("id"))){

                highlightObjects = [];

                var emTags = [{s:"<em class=\"red\">",r:"red"}, 
                              {s:"<em class=\"blue\">",r:"blue"}, 
                              {s:"<em class=\"bold\">",r:"bold"}];
                
                //temporary fix replacing <em class="red"> tags
                newTextValue = item.value;
                
                emTags.forEach(function(itemTag){
                    // search for em tags
                    index = newTextValue.indexOf(itemTag.s);
                    while(index >= 0){
                        startIndex = index;
                        endIndex = newTextValue.indexOf("</em>", startIndex);
                        
                        lastCrStart = newTextValue.lastIndexOf("\n", startIndex);
                        lineNumStart = newTextValue.substr(0, startIndex).split("\n").length-1;
                        startIndex = index - lastCrStart;
                        //startIndex -= itemTag.s.length;
                        
                        lastCrEnd = newTextValue.lastIndexOf("\n", endIndex);
                        lineNumEnd = newTextValue.substr(0, endIndex).split("\n").length-1;
                        endIndex = ((endIndex - itemTag.s.length) - lastCrEnd);
                        
                        newTextValue = scrub(newTextValue, itemTag.s);
                        newTextValue = scrub(newTextValue, "</em>");
                        index = newTextValue.indexOf(itemTag.s);
                        
                        cName = ""
                        switch(itemTag.r){
                            case "red":
                                cName = "vuln-highlight"; break;
                            case "blue":
                                cName = "nonvuln-highlight"; break;
                            case "bold":
                                cName = "bold"; break;
                            default: cName = ""; break;
                        }
                        
                        var styleObj = {
                            from:{line: lineNumStart, ch: startIndex-1}, 
                            to:{line: lineNumEnd, ch: endIndex-1}, 
                            obj:{className: cName}
                        }
                        
                        highlightObjects.push(styleObj);
                    }
                });
                
                item.value = newTextValue
            
                var editor = CodeMirror.fromTextArea(item, {
                        mode: "javascript", 
                        autoRefresh: true,
                        readOnly: true,
                        lineNumbers: true
                    });
                
                editor.setSize(null,"100%");
                
                highlightObjects.forEach(function(itemStyle){
                    editor.markText(itemStyle.from, itemStyle.to, itemStyle.obj)
                });
                
                editor.save();
                editor.refresh();
            }
        });
    }
}