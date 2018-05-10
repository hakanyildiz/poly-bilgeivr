(function () {

    var $app = document.getElementById('app');

    let json = {};

    function init() {

        fetch("./bilge.json").then(function (response) {
            return response.json();
        }).then(function (myJson) {
            var tree = [myJson];

            var res = recursive_tree(tree, 'li', 'ul');

            $app.appendChild(res);

        });

        recursive_tree = function (data, tag, child_wrapper, level) {
            var html = [];
            var result = document.createElement("div");
            level = level || 0;

            child_wrapper = (child_wrapper != false) ? child_wrapper : 'ul';

            data.forEach((obj, i) => {

                var el = document.createElement(tag);

                var containerElement = document.createElement("div");
                containerElement.classList.add('module-item');
                containerElement.addEventListener("click", visor, false);

                //dtmf
                if ( obj.hasOwnProperty('dtmf') ) {

                    if ( obj.dtmf.length > 0 ) {
                        var element = document.createElement("div");
                        element.classList.add('paper-fab');
                        var spanElement = document.createElement("span");
                        textNode = document.createTextNode(obj.dtmf);
                        spanElement.appendChild(textNode);
                        element.appendChild(spanElement);
                        containerElement.appendChild(element);
                    }
                }


                //Firstly, we should check if it includes 'modulename' or 'detailname' property
                var textNode = "";
                var titleElement  = document.createElement("h3");
                if ( obj.hasOwnProperty('modulename') ) {
                    //modulename
                    textNode = document.createTextNode(obj.modulename);
                }
                
                if ( obj.hasOwnProperty('detailname') ) {
                    //detailname
                    textNode = document.createTextNode(obj.detailname);
                }

                titleElement.appendChild(textNode);

                //other details wrapper 
                var ulElement = document.createElement("ol");
                
                //totalcall
                if ( obj.hasOwnProperty('totalcall') ) {
                    createListDetail("Toplam Çağrı Sayısı: " , obj.totalcall, ulElement);
                }

                //totalagent
                if ( obj.hasOwnProperty('totalagent') ) {
                    createListDetail("Toplam MT'ye Giden Çağrı: " , obj.totalagent, ulElement);
                }

                //totalhangup
                if ( obj.hasOwnProperty('totalhangup') ) {
                    createListDetail("Toplam Hangup Olan Çağrı: " , obj.totalhangup, ulElement);
                }

                //totaldisconnect
                if ( obj.hasOwnProperty('totaldisconnect') ) {
                    createListDetail("Toplam Disconnect Olan Çağrı: " , obj.totaldisconnect, ulElement);
                }

                //hangupperc
                if ( obj.hasOwnProperty('hangupperc') ) {

                    if ( obj.hangupperc.length != 0 ) {
                        createListDetail("Hangup Oranı: " , obj.hangupperc, ulElement);
                    }
                }

                //agentperc
                if ( obj.hasOwnProperty('agentperc') ) {

                    if ( obj.agentperc.length != 0 ) {
                        createListDetail("Agent Oranı: " , obj.agentperc, ulElement);
                    }
                }

                //totalperc
                if ( obj.hasOwnProperty('totalperc') ) {

                    if (obj.agentperc.length == 0 ) {
                        var element = document.createElement("li");
                        element.classList.add('total-perc');
                        textNode = document.createTextNode(obj.totalperc);
                        element.appendChild(textNode);
                        ulElement.appendChild(element);
                    }
                }
               
                var signElement = createSignItem();

                //append to containerElement
                containerElement.appendChild(signElement);
                containerElement.appendChild(titleElement);
                containerElement.appendChild(ulElement);

                el.appendChild(containerElement);

                if (obj.hasOwnProperty('details')) {
                    var wrapper = document.createElement(child_wrapper);
                    // wrapper.style.display = "none";

                    var els = recursive_tree(obj.details, tag, child_wrapper);

                    if (els.hasChildNodes()) {
                        wrapper.appendChild(els);
                    } else {
                        el.firstChild.removeChild(signElement);
                    }
                    el.appendChild(wrapper);
                }
                result.appendChild(el);

            });
            return result;
        }

        createSignItem = function () {

            var root = document.createElement("div");
            root.classList.add("circle-plus");
            root.classList.add("closed");

            var item = document.createElement("div");
            item.classList.add("circle");

            var itemH = document.createElement("div");
            itemH.classList.add("horizontal");

            var itemV = document.createElement("div");
            itemV.classList.add("vertical");

            item.appendChild(itemH);
            item.appendChild(itemV);

            root.appendChild(item);

            return root;
        }

        visor = function (event) {
            console.log(event.target);

            var moduleItem = event.target;
            var icon = event.target.firstChild;
            if (icon instanceof HTMLElement) {

                if (icon.classList.contains("opened")) {
                    icon.classList.remove("opened");
                    moduleItem.classList.remove("moduleopened")
                }
                else {
                    moduleItem.classList.add("moduleopened")
                    icon.classList.add("opened")
                }
            }

            var ul = event.target.parentNode.querySelector("ul");
            // console.log(ul);

            if (ul.classList.contains("active"))
                ul.classList.remove("active")
            else
                ul.classList.add("active")
            
        }


        createListDetail = function ( title, detail, wrapper) {
            var element = document.createElement("li");

            var dataElement = document.createElement("span");
            textNode = document.createTextNode(title);
            dataElement.appendChild(textNode);

            var detailElement = document.createElement("span");
            textNode = document.createTextNode(detail);
            detailElement.appendChild(textNode);

            element.appendChild(dataElement);
            element.appendChild(detailElement);

            element.appendChild(textNode);
            wrapper.appendChild(element);
        }

    }



    init();
})();