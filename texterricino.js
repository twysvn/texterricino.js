
_tc_debug = true

// html elements
_tc_elements = {};
_tc_content = {};
_tc_buttons = {};

// ...
_tc_ready = [];
_tc_parsers = {};
_tc_already_ready = false;

_tc_added_elements = [];
_tc_add_counter = 0;
_tc_change_events = {};

(function(){
    _tc_init(document)
    _tc_already_ready = true
    for (i in _tc_ready){
        if (_tc_ready.hasOwnProperty(i)) {
            _tc_ready[i]()
        }
    }

    var cols = document.querySelectorAll('[tc-element]');
    [].forEach.call(cols, _tc_addDnDHandlers);
})()

// public functions

function tc_ready(f){
    if (_tc_already_ready) {
        f()
    }else{
        _tc_ready.push(f)
    }
}

function tc_register(type, f) {
    if (_tc_debug) console.log("texterriccino: parser "+type);
    _tc_parsers[type] = f
}

// private functions

function _tc_get(data, query) {
    return data.querySelectorAll(query)
}

function _tc_init(data) {

    // get tc-element
    var els = _tc_get(data, "[tc-element]")
    for (var i in els) {
        if (els.hasOwnProperty(i)) {
            var el = els[i]
            console.log(el.parentNode);
            if(el.parentNode.getAttribute("tc-content") == null) {
                console.log(el);
                var type = el.getAttribute("tc-element")
                if (_tc_debug) console.log("texterriccino: register "+type);
                _tc_elements[type] = el
                el.parentNode.removeChild(el)
            }
        }
    }

    // tc-content
    els = _tc_get(data, "[tc-content]")
    for(i in els) {
        if (els.hasOwnProperty(i)) {
            var el = els[i]
            _tc_content[el.getAttribute("tc-content")] = el

            var mods = _tc_get(data, "[tc-element]")
            for (var j in mods) {
                if (mods.hasOwnProperty(j)) {
                    var mod = mods[j]
                    _tc_add_events(mod)
                }
            }
        }
    }

    // tc-buttons
    els = _tc_get(data, "[tc-buttons]")
    for(i in els) {
        if (els.hasOwnProperty(i)) {
            var el = els[i]
            _tc_buttons[el.getAttribute("tc-buttons")] = el
        }
    }
}

function _tc_add(button, type) {
    if (type in _tc_elements) {
        var el = _tc_elements[type]

        var p = button
        var tc_type = ""
        while (p.getAttribute("tc-toolbar") == null) {
            p = p.parentNode
        }
        tc_type = p.getAttribute("tc-toolbar")
        var content = _tc_content[tc_type]
        // content.innerHTML += el.outerHTML
        var newnode = el.cloneNode(true)

        content.appendChild(newnode)
        var last = content.children[content.children.length-1]

        var f = last.querySelectorAll("input, textarea")
        if(f.length > 0)
            f[0].focus()
        _tc_addDnDHandlers(newnode)
        _tc_add_events(newnode)
        return newnode
    }else{
        console.log("maybe lost a module, eh?");
    }
}

function _tc_parse(data) {
    var ret = []
    var els = _tc_get(data, "[tc-element]")
    for (i in els){
        if (els.hasOwnProperty(i)) {
            var el = els[i]
            var type = el.getAttribute("tc-element")
            if (!_tc_parsers[type]) {
                console.log("unknown parsers: " + type);
                return;
            }
            ret.push({
                type: type,
                data: _tc_parsers[type](el.children[0])
            })
        }
    }
    return ret
}

function _tc_save(src) {
    var p = src
    while (p.getAttribute("tc-buttons") == null) {
        p = p.parentNode
    }
    var content = _tc_content[p.getAttribute("tc-buttons")]
    var data = _tc_parse(content)
    var url = content.getAttribute("tc-ajax")
    ajax(url, "POST", JSON.stringify({"root":data}), function(e){
        console.log("success", e);
    }, function(e){
        console.log("fail", e);
    })
}

function _tc_draft(src) {

}

// add change listener to each child input, texarea usw
function _tc_add_events(el) {
    _tc_added_elements[_tc_add_counter] = (el)
    el.setAttribute("_tc_id", ""+(_tc_add_counter++))
    var inputs = _tc_get(el, "input,textarea")
    for (var j in inputs) {
        if (inputs.hasOwnProperty(j)) {
            var input = inputs[j]

            input.addEventListener("change", (function(e){
                return function() {
                    _tc_preview(e);
                };
            })(el));
        }
    }
}

function _tc_preview(elem) {
    var previewelems = _tc_get(elem, "[tc-preview]");
    if (previewelems.length == 0) {
        return;
    }
    var tmp = document.createElement("div")
    tmp.appendChild(elem.cloneNode(true))
    var data = _tc_parse(tmp)
    for (var i in previewelems) {
        if (previewelems.hasOwnProperty(i)) {
            var previewelem = previewelems[i]

            var url = previewelem.getAttribute("tc-preview")
            var div = document.createElement("div")
            var con = elem.serialize_dom()
            div.innerHTML = "Loading.."
            previewelem.appendChild(div)
            _sbecky_form_ajax(url, "POST", con, function(e){
                // console.log(e);
                (function(div, previewelem) {
                    div.innerHTML = e
                    while (previewelem.firstChild) {
                        previewelem.removeChild(previewelem.firstChild);
                    }
                    previewelem.appendChild(div)
                })(div, previewelem);
            }, function(e){
                console.log(e);
                // previewelem.innerHTML = ""
                div.innerHTML = "error"
                // previewelem.appendChild(div)
            })
        }
    }
}

function tc_preview(elem) {
    var previewelems = _tc_get(elem, "[tc-preview]");
    if (previewelems.length == 0) {
        return;
    }
    var tmp = document.createElement("div")
    tmp.appendChild(elem.cloneNode(true))
    var data = _tc_parse(tmp)
    for (var i in previewelems) {
        if (previewelems.hasOwnProperty(i)) {
            var previewelem = previewelems[i]

            var url = previewelem.getAttribute("tc-preview")
            var div = document.createElement("div")
            var con = {"input":JSON.stringify({"root":data})}
            ajax(url, "POST", con, function(e){
                console.log(e);
                (function(div, previewelem) {
                    div.innerHTML = e
                    while (previewelem.firstChild) {
                        previewelem.removeChild(previewelem.firstChild);
                    }
                    previewelem.appendChild(div)
                })(div, previewelem);
            }, function(e){
                div.innerHTML = "error"
                previewelem.appendChild(div)
            })
        }
    }
}


function tc_updateimage(el) {
    // TODO: check if really is image
    var img = el.parentNode.getElementsByTagName('img')
    if (img.length > 0) {
        img[0].src = el.value
    }
}

function tc_removemodule(module) {
    var p = module
    while (p.getAttribute("tc-element") == null) {
        p = p.parentNode
    }
    p.parentNode.removeChild(p);
}

function tc_movemodule(elem, amount) {
    var p = elem
    while (p.getAttribute("tc-element") == null) {
        p = p.parentNode
    }
    var sibling = p;
    while (amount > 0) {
        if (sibling == null) break;
        sibling = sibling.nextElementSibling
        amount--
        if (amount == 0 && sibling) {
            sibling = sibling.nextElementSibling
        }
    }
    while (amount < 0) {
        if (sibling == null) break;
        sibling = sibling.previousElementSibling
        amount++
    }
    var parent = p.parentNode
    parent.removeChild(p);
    if (sibling != null) {
        parent.insertBefore(p, sibling);
    }else{
        parent.appendChild(p)
    }
}


//drag n drop
var dragSrcEl = null;

function _tc_handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  // e.dataTransfer.setData('text/html', this.outerHTML);
  this.classList.add('dragElem');
}
function _tc_handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  this.classList.add('dragOver');
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function _tc_handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function _tc_handleDragLeave(e) {
  this.classList.remove('dragOver');
}

function _tc_handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
    dragSrcEl.parentNode.removeChild(dragSrcEl);
    this.parentNode.insertBefore(dragSrcEl, this)
    // var dropHTML = e.dataTransfer.getData('text/html');
    // this.insertAdjacentHTML('beforebegin',dropHTML);
    // var dropElem = this.previousSibling;
    // tc_addDnDHandlers(dropElem);
  }
  this.classList.remove('dragOver');
  return false;
}

function _tc_handleDragEnd(e) {
  this.classList.remove('dragOver');

  /*[].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });*/
}

function _tc_addDnDHandlers(elem) {
  elem.addEventListener('dragstart', _tc_handleDragStart, false);
  elem.addEventListener('dragenter', _tc_handleDragEnter, false)
  elem.addEventListener('dragover', _tc_handleDragOver, false);
  elem.addEventListener('dragleave', _tc_handleDragLeave, false);
  elem.addEventListener('drop', _tc_handleDrop, false);
  elem.addEventListener('dragend', _tc_handleDragEnd, false);
}
