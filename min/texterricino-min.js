function tc_ready(e){_tc_already_ready?e():_tc_ready.push(e)}function tc_register(e,t){_tc_debug&&console.log("texterriccino: parser "+e),_tc_parsers[e]=t}function _tc_get(e,t){return e.querySelectorAll(t)}function _tc_init(e){var t=_tc_get(e,"[tc-element]");for(var r in t)if(t.hasOwnProperty(r)){var n=t[r];if(console.log(n.parentNode),null==n.parentNode.getAttribute("tc-content")){console.log(n);var a=n.getAttribute("tc-element");_tc_debug&&console.log("texterriccino: register "+a),(_tc_elements[a]=n).parentNode.removeChild(n)}}for(r in t=_tc_get(e,"[tc-content]"))if(t.hasOwnProperty(r)){var n=t[r];_tc_content[n.getAttribute("tc-content")]=n;var c=_tc_get(e,"[tc-element]");for(var o in c){var i;if(c.hasOwnProperty(o))_tc_add_events(c[o])}}for(r in t=_tc_get(e,"[tc-buttons]"))if(t.hasOwnProperty(r)){var n=t[r];_tc_buttons[n.getAttribute("tc-buttons")]=n}}function _tc_add(e,t){if(t in _tc_elements){for(var r=_tc_elements[t],n=e,a="";null==n.getAttribute("tc-toolbar");)n=n.parentNode;a=n.getAttribute("tc-toolbar");var c=_tc_content[a],o=r.cloneNode(!0);c.appendChild(o);var i,d=c.children[c.children.length-1].querySelectorAll("input, textarea");return 0<d.length&&d[0].focus(),_tc_addDnDHandlers(o),_tc_add_events(o),o}console.log("maybe lost a module, eh?")}function _tc_parse(e){var t=[],r=_tc_get(e,"[tc-element]");for(i in r)if(r.hasOwnProperty(i)){var n=r[i],a=n.getAttribute("tc-element");if(!_tc_parsers[a])return void console.log("unknown parsers: "+a);t.push({type:a,data:_tc_parsers[a](n.children[0])})}return t}function _tc_save(e){for(var t=e;null==t.getAttribute("tc-buttons");)t=t.parentNode;var r=_tc_content[t.getAttribute("tc-buttons")],n=_tc_parse(r),a=r.getAttribute("tc-ajax");ajax(a,"POST",JSON.stringify({root:n}),function(e){console.log("success",e)},function(e){console.log("fail",e)})}function _tc_draft(e){}function _tc_add_events(e){(_tc_added_elements[_tc_add_counter]=e).setAttribute("_tc_id",""+_tc_add_counter++);var t=_tc_get(e,"input,textarea");for(var r in t){var n;if(t.hasOwnProperty(r))t[r].addEventListener("change",function(e){return function(){_tc_preview(e)}}(e))}}function _tc_preview(e){var t=_tc_get(e,"[tc-preview]");if(0!=t.length){var r=document.createElement("div");r.appendChild(e.cloneNode(!0));var n=_tc_parse(r);for(var a in t)if(t.hasOwnProperty(a)){var c=t[a],o=c.getAttribute("tc-preview"),i=document.createElement("div"),d=e.serialize_dom();i.innerHTML="Loading..",c.appendChild(i),_sbecky_form_ajax(o,"POST",d,function(r){!function(e,t){for(e.innerHTML=r;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(e)}(i,c)},function(e){console.log(e),i.innerHTML="error"})}}}function tc_preview(e){var t=_tc_get(e,"[tc-preview]");if(0!=t.length){var r=document.createElement("div");r.appendChild(e.cloneNode(!0));var n=_tc_parse(r);for(var a in t)if(t.hasOwnProperty(a)){var c=t[a],o=c.getAttribute("tc-preview"),i=document.createElement("div"),d={input:JSON.stringify({root:n})};ajax(o,"POST",d,function(r){console.log(r),function(e,t){for(e.innerHTML=r;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(e)}(i,c)},function(e){i.innerHTML="error",c.appendChild(i)})}}}function tc_updateimage(e){var t=e.parentNode.getElementsByTagName("img");0<t.length&&(t[0].src=e.value)}function tc_removemodule(e){for(var t=e;null==t.getAttribute("tc-element");)t=t.parentNode;t.parentNode.removeChild(t)}function tc_movemodule(e,t){for(var r=e;null==r.getAttribute("tc-element");)r=r.parentNode;for(var n=r;0<t&&null!=n;)n=n.nextElementSibling,0==--t&&n&&(n=n.nextElementSibling);for(;t<0&&null!=n;)n=n.previousElementSibling,t++;var a=r.parentNode;a.removeChild(r),null!=n?a.insertBefore(r,n):a.appendChild(r)}_tc_debug=!0,_tc_elements={},_tc_content={},_tc_buttons={},_tc_ready=[],_tc_parsers={},_tc_already_ready=!1,_tc_added_elements=[],_tc_add_counter=0,_tc_change_events={},function(){for(i in _tc_init(document),_tc_already_ready=!0,_tc_ready)_tc_ready.hasOwnProperty(i)&&_tc_ready[i]();var e=document.querySelectorAll("[tc-element]");[].forEach.call(e,_tc_addDnDHandlers)}();var dragSrcEl=null;function _tc_handleDragStart(e){dragSrcEl=this,e.dataTransfer.effectAllowed="move",this.classList.add("dragElem")}function _tc_handleDragOver(e){return e.preventDefault&&e.preventDefault(),this.classList.add("dragOver"),!(e.dataTransfer.dropEffect="move")}function _tc_handleDragEnter(e){}function _tc_handleDragLeave(e){this.classList.remove("dragOver")}function _tc_handleDrop(e){return e.stopPropagation&&e.stopPropagation(),dragSrcEl!=this&&(dragSrcEl.parentNode.removeChild(dragSrcEl),this.parentNode.insertBefore(dragSrcEl,this)),this.classList.remove("dragOver"),!1}function _tc_handleDragEnd(e){this.classList.remove("dragOver")}function _tc_addDnDHandlers(e){e.addEventListener("dragstart",_tc_handleDragStart,!1),e.addEventListener("dragenter",_tc_handleDragEnter,!1),e.addEventListener("dragover",_tc_handleDragOver,!1),e.addEventListener("dragleave",_tc_handleDragLeave,!1),e.addEventListener("drop",_tc_handleDrop,!1),e.addEventListener("dragend",_tc_handleDragEnd,!1)}