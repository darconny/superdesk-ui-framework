"use strict";function CarouselDirective(){return{scope:{currentStep:"=",finish:"&",model:"="},templateUrl:"app/template/carousel.html",transclude:!0,controllerAs:"ctrl",controller:["$scope","$document",function($scope,$document){function unselectAll(){_.each($scope.steps,function(step){step.selected=!1}),$scope.selectedStep=null}var self=this;$scope.selectedStep=null,$scope.pageIndex=0,$scope.steps=[],$scope.goTo=function(step){unselectAll(),$scope.selectedStep=step,$scope.pageIndex=_.indexOf($scope.steps,step),_.isUndefined($scope.currentStep)||($scope.currentStep=step.code),step.selected=!0},this.addStep=function(step){$scope.steps.push(step),$scope.$watch("currentStep",function(stepCode){stepCode&&($scope.selectedStep&&$scope.selectedStep.code!==stepCode||!$scope.selectedStep)&&$scope.goTo(_.find($scope.steps,{code:stepCode}))}),$scope.selectedStep||this.goTo(0)},this.goTo=function(step){var stepTo;stepTo=_.isNumber(step)?$scope.steps[step]:_.find($scope.steps,{code:step}),$scope.goTo(stepTo)},this.next=function(){var index=_.indexOf($scope.steps,$scope.selectedStep);index===$scope.steps.length-1?this.finish():$scope.goTo($scope.steps[index+1])},this.previous=function(){var index=_.indexOf($scope.steps,$scope.selectedStep);index>0&&$scope.goTo($scope.steps[index-1])},this.finish=function(){$scope.finish&&$scope.finish()},$document.bind("keydown",function(e){37===e.keyCode?$scope.$applyAsync(function(){self.previous()}):39===e.keyCode&&$scope.$applyAsync(function(){self.next()})}),$scope.$on("$destroy",function(){$document.unbind("keydown")})}],link:function(scope,elem){scope.$watch("model",function(){scope.model?elem.show():elem.hide()})}}}function CarouselStepDirective(){return{scope:{code:"@"},template:'<div class="sd-carousel__page fade" ng-show="selected" ng-transclude></div>',transclude:!0,replace:!0,require:"^sdCarousel",link:function(scope,elem,attr,carousel){carousel.addStep(scope)}}}function WizardHandlerFactory(){var service={},wizards={};return service.defaultName="defaultWizard",service.addWizard=function(name,wizard){wizards[name]=wizard},service.removeWizard=function(name){delete wizards[name]},service.wizard=function(name){return wizards[name||service.defaultName]},service}function WizardDirective(){return{templateUrl:"app/template/wizard.html",scope:{currentStep:"=",finish:"&",name:"@"},transclude:!0,controller:["$scope","WizardHandler",function($scope,WizardHandler){function unselectAll(){_.each($scope.steps,function(step){step.selected=!1}),$scope.selectedStep=null}WizardHandler.addWizard($scope.name||WizardHandler.defaultName,this),$scope.$on("$destroy",function(){WizardHandler.removeWizard($scope.name||WizardHandler.defaultName)}),$scope.selectedStep=null,$scope.steps=[];var stopWatch;this.addStep=function(step){$scope.steps.push(step),stopWatch||(stopWatch=$scope.$watch("currentStep",function(stepCode){stepCode&&($scope.selectedStep&&$scope.selectedStep.code!==stepCode||!$scope.selectedStep)&&$scope.goTo(_.find($scope.steps,{code:stepCode}))})),$scope.selectedStep||this.goTo(0)},$scope.goTo=function(step){unselectAll(),$scope.selectedStep=step,_.isUndefined($scope.currentStep)||($scope.currentStep=step.code),step.selected=!0},this.goTo=function(step){var stepTo;stepTo=_.isNumber(step)?$scope.steps[step]:_.find($scope.steps,{code:step}),$scope.goTo(stepTo)},this.next=function(){var index=_.indexOf($scope.steps,$scope.selectedStep);index===$scope.steps.length-1?this.finish():$scope.goTo($scope.steps[index+1])},this.previous=function(){var index=_.indexOf($scope.steps,$scope.selectedStep);$scope.goTo($scope.steps[index-1])},this.finish=function(){$scope.finish&&$scope.finish()}}]}}function WizardStepDirective(){return{templateUrl:"app/template/wizardStep.html",scope:{title:"@",code:"@",disabled:"=",hide:"="},transclude:!0,require:"^sdWizard",link:function($scope,element,attrs,wizard){wizard.addStep($scope)}}}function sdDropdown($window){return{link:function(scope,elem){function closeToBottom(event){return event.clientY>$window.innerHeight-(menu.outerHeight()+button.outerHeight())}function closeToLeft(){return elem.offset().left<menu.outerWidth()}function closeToRight(){return $window.innerWidth-button.offset().left-button.outerWidth()<menu.outerWidth()}var menu=elem.children(".dropdown__menu"),button=elem.children("[dropdown__toggle]"),settings={isTopOriented:menu.hasClass("dropdown--dropup"),isRightOriented:menu.hasClass("dropdown--align-right"),isInlineOriented:elem.hasClass("dropdown--dropright")||elem.hasClass("dropdown--dropleft")};button.bind("click mouseover",function(event){closeToBottom(event)?elem.addClass("dropdown--dropup"):settings.isTopOriented||elem.removeClass("dropdown--dropup"),closeToLeft()?menu.removeClass("dropdown--align-right"):settings.isRightOriented&&menu.addClass("dropdown--align-right"),closeToRight()?menu.addClass("dropdown--align-right"):settings.isRightOriented||menu.removeClass("dropdown--align-right")})}}}function sdDropdownAppendToBody($window){return{require:"dropdown",link:function(scope,elem,attr,ctrl){function closeToRight(menu){return $window.innerWidth-elem.offset().left<menu.outerWidth()}var button=elem.find("[dropdown__toggle]");scope.$watch(ctrl.isOpen,function(isOpen){if(!isOpen)return!1;var style={display:isOpen?"block":"none",top:elem.offset().top+button.outerHeight(),left:elem.offset().left,opacity:1};scope.$evalAsync(function(){ctrl.dropdownMenu.css({opacity:0})}),scope.$applyAsync(function(){elem.hasClass("dropdown--dropup")&&(style.top=elem.offset().top-ctrl.dropdownMenu.outerHeight()),closeToRight(ctrl.dropdownMenu)&&(style.left=$window.innerWidth-ctrl.dropdownMenu.outerWidth()-15),ctrl.dropdownMenu.css(style)})})}}}function sdModal($document){return{template:['<div class="modal" data-backdrop="static">','<div class="modal__dialog" ng-if="model"><div class="modal__content" ng-transclude></div></div>','</div><div class="modal__backdrop fade in" ng-if="model"></div>'].join(""),transclude:!0,scope:{model:"="},link:function(scope,element){function initialized(){return _initialized&&content}var content,_initialized=!1;scope.$watch("model",function(){scope.model?(initialized()||(content=element.children(),content.addClass(element.attr("class")),content.appendTo($document.find("body")),content[0].foo="bar",_initialized=!0),content.show().addClass("in"),$document.find("body").addClass("modal-open")):initialized()&&(content.hide().removeClass("in"),$document.find("body").removeClass("modal-open"),closeModal())});var closeModal=function(){scope.model=!1,scope.$evalAsync()};scope.$on("$destroy",function(){initialized()&&(content.hide(),content.remove())})}}}function sdSwitch(){return{require:"ngModel",replace:!0,template:['<span class="sd-toggle">','<span class="inner"></span>',"</span>"].join(""),link:function($scope,element,attrs,ngModel){function render(element,value){element.toggleClass("checked",!!value),element.attr("checked",!!value)}var Keys={pageup:33,pagedown:34,left:37,up:38,right:39,down:40,enter:13,escape:27,space:32,backspace:8};ngModel.$render=function(){render(element,ngModel.$viewValue)},element.bind("keydown",function(e){if(e.keyCode===Keys.enter||e.keyCode===Keys.space)return e.preventDefault(),$scope.$apply(function(){ngModel.$setViewValue(!ngModel.$viewValue)}),!1}),$scope.$watch(attrs.ngModel,function(){render(element,ngModel.$viewValue)}),element.on("click",function(e){return $scope.$apply(function(){ngModel.$setViewValue(!ngModel.$viewValue)}),!1}),$scope.$on("$destroy",function(){element.unbind("keydown"),element.off("click")})}}}function sdCheck(){return{require:"ngModel",replace:!0,transclude:!0,template:'<span class="sd-check__wrapper"><span class="sd-checkbox"></span><label ng-transclude></label></span>',link:function($scope,element,attrs,ngModel){function render(label,checkbox,value){"radio"===attrs.type&&(value=ngModel.$viewValue===attrs.ngValue,checkbox.addClass("sd-checkbox--radio")),attrs.disabled&&(checkbox.addClass("sd-checkbox sd-checkbox--disabled"),label.addClass("sd-label--disabled")),checkbox.toggleClass("checked",!!value).attr("checked",!!value),"inside"!==attrs.labelPosition&&label.toggleClass("label--active",!!value)}var label=element.find("label"),checkbox=element.find("span");ngModel.$render=function(){render(label,checkbox,ngModel.$viewValue)},$scope.$watch(attrs.ngModel,function(){render(label,checkbox,ngModel.$viewValue)}),element.on("click",function(){if(attrs.disabled)return!1;$scope.$apply(function(){return"radio"===attrs.type?ngModel.$setViewValue(attrs.ngValue):ngModel.$setViewValue(!ngModel.$viewValue)})}),"inside"===attrs.labelPosition?checkbox.html(label).addClass("sd-checkbox sd-checkbox--button-style"):"left"===attrs.labelPosition&&label.after(checkbox)}}}angular.module("superdesk-ui.templates-cache",[]).run(["$templateCache",function($templateCache){$templateCache.put("app/template/backdrop.html",'<div class="modal__backdrop fade in"></div>'),$templateCache.put("app/template/carousel.html",'<div class="sd-carousel__backdrop"></div><div class="sd-carousel"><div class="sd-carousel__dialog"><div class="sd-carousel__content" ng-transclude></div><a class="sd-carousel__nav-button sd-carousel__nav-button--prev" ng-click="ctrl.previous()" ng-hide="pageIndex === 0"></a> <a class="sd-carousel__nav-button" ng-click="pageIndex === steps.length-1 ? ctrl.finish() : ctrl.next()" ng-class="pageIndex === steps.length-1 ? \'sd-carousel__nav-button--end\' : \'sd-carousel__nav-button--next\'"></a><div class="sd-carousel__page-indication-bar"><span ng-repeat="step in steps" class="sd-carousel__page-indicator" ng-class="{\'sd-carousel__page-indicator--selected\': step.selected}" ng-click="goTo(step)"></span></div></div></div>'),$templateCache.put("app/template/window.html",'<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal" modal-animation-class="fade" modal-in-class="in" ng-style="{\'z-index\': 1050 + index * 10, display: \'block\'}" ng-class="size ? \'modal--\' + size : \'\'"><div class="modal__dialog"><div class="modal__content" modal-transclude></div></div></div>'),$templateCache.put("app/template/wizard.html",'<div class="modal__body-header"><ul class="nav-tabs"><li ng-repeat="step in steps" ng-class="{\'nav-tabs__tab--active\': step.selected}" class="nav-tabs__tab"><button ng-click="goTo(step)" ng-disabled="step.disabled" ng-hide="step.hide" class="nav-tabs__link" translate>{{ step.title}}</button></li></ul></div><div class="modal__body-content" ng-transclude></div>'),$templateCache.put("app/template/wizardStep.html",'<div ng-show="selected" class="modal-screen" ng-transclude></div>')}]),angular.module("superdesk-ui.helper.position",[]).factory("$position",["$document","$window",function($document,$window){function getStyle(el,cssprop){return el.currentStyle?el.currentStyle[cssprop]:$window.getComputedStyle?$window.getComputedStyle(el)[cssprop]:el.style[cssprop]}function isStaticPositioned(element){return"static"===(getStyle(element,"position")||"static")}var parentOffsetEl=function(element){for(var docDomEl=$document[0],offsetParent=element.offsetParent||docDomEl;offsetParent&&offsetParent!==docDomEl&&isStaticPositioned(offsetParent);)offsetParent=offsetParent.offsetParent;return offsetParent||docDomEl};return{position:function(element){var elBCR=this.offset(element),offsetParentBCR={top:0,left:0},offsetParentEl=parentOffsetEl(element[0]);offsetParentEl!=$document[0]&&(offsetParentBCR=this.offset(angular.element(offsetParentEl)),offsetParentBCR.top+=offsetParentEl.clientTop-offsetParentEl.scrollTop,offsetParentBCR.left+=offsetParentEl.clientLeft-offsetParentEl.scrollLeft);var boundingClientRect=element[0].getBoundingClientRect();return{width:boundingClientRect.width||element.prop("offsetWidth"),height:boundingClientRect.height||element.prop("offsetHeight"),top:elBCR.top-offsetParentBCR.top,left:elBCR.left-offsetParentBCR.left}},offset:function(element){var boundingClientRect=element[0].getBoundingClientRect();return{width:boundingClientRect.width||element.prop("offsetWidth"),height:boundingClientRect.height||element.prop("offsetHeight"),top:boundingClientRect.top+($window.pageYOffset||$document[0].documentElement.scrollTop),left:boundingClientRect.left+($window.pageXOffset||$document[0].documentElement.scrollLeft)}},positionElements:function(hostEl,targetEl,positionStr,appendToBody){var hostElPos,targetElWidth,targetElHeight,targetElPos,positionStrParts=positionStr.split("-"),pos0=positionStrParts[0],pos1=positionStrParts[1]||"center";hostElPos=appendToBody?this.offset(hostEl):this.position(hostEl),targetElWidth=targetEl.prop("offsetWidth"),targetElHeight=targetEl.prop("offsetHeight");var shiftWidth={center:function(){return hostElPos.left+hostElPos.width/2-targetElWidth/2},left:function(){return hostElPos.left},right:function(){return hostElPos.left+hostElPos.width}},shiftHeight={center:function(){return hostElPos.top+hostElPos.height/2-targetElHeight/2},top:function(){return hostElPos.top},bottom:function(){return hostElPos.top+hostElPos.height}};switch(pos0){case"right":targetElPos={top:shiftHeight[pos1](),left:shiftWidth[pos0]()};break;case"left":targetElPos={top:shiftHeight[pos1](),left:hostElPos.left-targetElWidth};break;case"bottom":targetElPos={top:shiftHeight[pos0](),left:shiftWidth[pos1]()};break;default:targetElPos={top:hostElPos.top-targetElHeight,left:shiftWidth[pos1]()}}return targetElPos}}}]),angular.module("superdesk-ui.helper.dropdown",["superdesk-ui.helper.position"]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document","$rootScope",function($document,$rootScope){var openScope=null;this.open=function(dropdownScope){openScope||($document.bind("click",closeDropdown),$document.bind("keydown",keybindFilter)),openScope&&openScope!==dropdownScope&&(openScope.isOpen=!1),openScope=dropdownScope},this.close=function(dropdownScope){openScope===dropdownScope&&(openScope=null,$document.unbind("click",closeDropdown),$document.unbind("keydown",keybindFilter))};var closeDropdown=function(evt){if(openScope&&(!evt||"disabled"!==openScope.getAutoClose())){var toggleElement=openScope.getToggleElement();if(!(evt&&toggleElement&&toggleElement[0].contains(evt.target))){var dropdownElement=openScope.getDropdownElement();evt&&"outsideClick"===openScope.getAutoClose()&&dropdownElement&&dropdownElement[0].contains(evt.target)||(openScope.isOpen=!1,$rootScope.$$phase||openScope.$apply())}}},keybindFilter=function(evt){27===evt.which?(openScope.focusToggleElement(),closeDropdown()):openScope.isKeynavEnabled()&&/(38|40)/.test(evt.which)&&openScope.isOpen&&(evt.preventDefault(),evt.stopPropagation(),openScope.focusDropdownEntry(evt.which))}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate","$position","$document","$compile","$templateRequest",function($scope,$attrs,$parse,dropdownConfig,dropdownService,$animate,$position,$document,$compile,$templateRequest){var templateScope,getIsOpen,self=this,scope=$scope.$new(),openClass=dropdownConfig.openClass,setIsOpen=angular.noop,toggleInvoker=$attrs.onToggle?$parse($attrs.onToggle):angular.noop,appendToBody=!1,keynavEnabled=!1;this.init=function(element){self.$element=element,$attrs.isOpen&&(getIsOpen=$parse($attrs.isOpen),setIsOpen=getIsOpen.assign,$scope.$watch(getIsOpen,function(value){scope.isOpen=!!value})),appendToBody=angular.isDefined($attrs.dropdownAppendToBody),keynavEnabled=angular.isDefined($attrs.keyboardNav),appendToBody&&self.dropdownMenu&&($document.find("body").append(self.dropdownMenu),element.on("$destroy",function(){self.dropdownMenu.remove()}))},this.toggle=function(open){return scope.isOpen=arguments.length?!!open:!scope.isOpen},this.isOpen=function(){return scope.isOpen},scope.getToggleElement=function(){return self.toggleElement},scope.getAutoClose=function(){return $attrs.autoClose||"always"},scope.getElement=function(){return self.$element},scope.isKeynavEnabled=function(){return keynavEnabled},scope.focusDropdownEntry=function(keyCode){var elems=self.dropdownMenu?angular.element(self.dropdownMenu).find("a"):angular.element(self.$element).find("ul").eq(0).find("a");switch(keyCode){case 40:angular.isNumber(self.selectedOption)?self.selectedOption=self.selectedOption===elems.length-1?self.selectedOption:self.selectedOption+1:self.selectedOption=0;break;case 38:if(!angular.isNumber(self.selectedOption))return;self.selectedOption=0===self.selectedOption?0:self.selectedOption-1}elems[self.selectedOption].focus()},scope.getDropdownElement=function(){return self.dropdownMenu},scope.focusToggleElement=function(){self.toggleElement&&self.toggleElement[0].focus()},scope.$watch("isOpen",function(isOpen,wasOpen){if(appendToBody&&self.dropdownMenu){var pos=$position.positionElements(self.$element,self.dropdownMenu,"bottom-left",!0),css={top:pos.top+"px",display:isOpen?"block":"none"};self.dropdownMenu.hasClass("dropdown-menu-right")?(css.left="auto",css.right=window.innerWidth-(pos.left+self.$element.prop("offsetWidth"))+"px"):(css.left=pos.left+"px",css.right="auto"),self.dropdownMenu.css(css)}if($animate[isOpen?"addClass":"removeClass"](self.$element,openClass).then(function(){angular.isDefined(isOpen)&&isOpen!==wasOpen&&toggleInvoker($scope,{open:!!isOpen})}),isOpen)self.dropdownMenuTemplateUrl&&$templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent){templateScope=scope.$new(),$compile(tplContent.trim())(templateScope,function(dropdownElement){var newEl=dropdownElement;self.dropdownMenu.replaceWith(newEl),self.dropdownMenu=newEl})}),scope.focusToggleElement(),dropdownService.open(scope);else{if(self.dropdownMenuTemplateUrl){templateScope&&templateScope.$destroy();var newEl=angular.element('<ul class="dropdown-menu"></ul>');self.dropdownMenu.replaceWith(newEl),self.dropdownMenu=newEl}dropdownService.close(scope),self.selectedOption=null}setIsOpen($scope,isOpen)}),$scope.$on("$locationChangeSuccess",function(){"disabled"!==scope.getAutoClose()&&(scope.isOpen=!1)}),$scope.$on("$destroy",function(){scope.$destroy()})}]).directive("dropdown",function(){return{controller:"DropdownController",link:function(scope,element,attrs,dropdownCtrl){dropdownCtrl.init(element),element.addClass("dropdown")}}}).directive("dropdownMenu",function(){return{restrict:"AC",require:"?^dropdown",link:function(scope,element,attrs,dropdownCtrl){if(dropdownCtrl){var tplUrl=attrs.templateUrl;tplUrl&&(dropdownCtrl.dropdownMenuTemplateUrl=tplUrl),dropdownCtrl.dropdownMenu||(dropdownCtrl.dropdownMenu=element)}}}}).directive("keyboardNav",function(){return{restrict:"A",require:"?^dropdown",link:function(scope,element,attrs,dropdownCtrl){element.bind("keydown",function(e){if([38,40].indexOf(e.which)!==-1){e.preventDefault(),e.stopPropagation();var elems=angular.element(element).find("a");switch(e.keyCode){case 40:angular.isNumber(dropdownCtrl.selectedOption)?dropdownCtrl.selectedOption=dropdownCtrl.selectedOption===elems.length-1?dropdownCtrl.selectedOption:dropdownCtrl.selectedOption+1:dropdownCtrl.selectedOption=0;break;case 38:dropdownCtrl.selectedOption=0===dropdownCtrl.selectedOption?0:dropdownCtrl.selectedOption-1}elems[dropdownCtrl.selectedOption].focus()}})}}}).directive("dropdownToggle",function(){return{require:"?^dropdown",link:function(scope,element,attrs,dropdownCtrl){if(dropdownCtrl){element.addClass("dropdown-toggle"),dropdownCtrl.toggleElement=element;var toggleDropdown=function(event){event.preventDefault(),element.hasClass("disabled")||attrs.disabled||scope.$apply(function(){dropdownCtrl.toggle()})};element.bind("click",toggleDropdown),element.attr({"aria-haspopup":!0,"aria-expanded":!1}),scope.$watch(dropdownCtrl.isOpen,function(isOpen){element.attr("aria-expanded",!!isOpen)}),scope.$on("$destroy",function(){element.unbind("click",toggleDropdown)})}}}}),angular.module("superdesk-ui.helper.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var stack=[];return{add:function(key,value){stack.push({key:key,value:value})},get:function(key){for(var i=0;i<stack.length;i++)if(key==stack[i].key)return stack[i]},keys:function(){for(var keys=[],i=0;i<stack.length;i++)keys.push(stack[i].key);return keys},top:function(){return stack[stack.length-1]},remove:function(key){for(var idx=-1,i=0;i<stack.length;i++)if(key==stack[i].key){idx=i;break}return stack.splice(idx,1)[0]},removeTop:function(){return stack.splice(stack.length-1,1)[0]},length:function(){return stack.length}}}}}).directive("modalBackdrop",["$animate","$modalStack",function($animate,$modalStack){function linkFn(scope,element,attrs){attrs.modalInClass&&($animate.addClass(element,attrs.modalInClass),scope.$on($modalStack.NOW_CLOSING_EVENT,function(e,setIsAsync){var done=setIsAsync();$animate.removeClass(element,attrs.modalInClass).then(done)}))}return{restrict:"EA",replace:!0,templateUrl:"app/template/backdrop.html",compile:function(tElement,tAttrs){return tElement.addClass(tAttrs.backdropClass),linkFn}}}]).directive("modalWindow",["$modalStack","$q","$animate",function($modalStack,$q,$animate){return{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:function(tElement,tAttrs){return tAttrs.templateUrl||"app/template/window.html"},link:function(scope,element,attrs){element.addClass(attrs.windowClass||""),scope.size=attrs.size,scope.close=function(evt){var modal=$modalStack.getTop();modal&&modal.value.backdrop&&"static"!=modal.value.backdrop&&evt.target===evt.currentTarget&&(evt.preventDefault(),evt.stopPropagation(),$modalStack.dismiss(modal.key,"backdrop click"))},scope.$isRendered=!0;var modalRenderDeferObj=$q.defer();attrs.$observe("modalRender",function(value){"true"==value&&modalRenderDeferObj.resolve()}),modalRenderDeferObj.promise.then(function(){attrs.modalInClass&&($animate.addClass(element,attrs.modalInClass),scope.$on($modalStack.NOW_CLOSING_EVENT,function(e,setIsAsync){var done=setIsAsync();$animate.removeClass(element,attrs.modalInClass).then(done)}));var inputsWithAutofocus=element[0].querySelectorAll("[autofocus]");inputsWithAutofocus.length?inputsWithAutofocus[0].focus():element[0].focus();var modal=$modalStack.getTop();modal&&$modalStack.modalRendered(modal.key)})}}}]).directive("modalAnimationClass",[function(){return{compile:function(tElement,tAttrs){tAttrs.modalAnimation&&tElement.addClass(tAttrs.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function($scope,$element,$attrs,controller,$transclude){$transclude($scope.$parent,function(clone){$element.empty(),$element.append(clone)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$q","$$stackedMap",function($animate,$timeout,$document,$compile,$rootScope,$q,$$stackedMap){function backdropIndex(){for(var topBackdropIndex=-1,opened=openedWindows.keys(),i=0;i<opened.length;i++)openedWindows.get(opened[i]).value.backdrop&&(topBackdropIndex=i);return topBackdropIndex}function removeModalWindow(modalInstance,elementToReceiveFocus){var body=$document.find("body").eq(0),modalWindow=openedWindows.get(modalInstance).value;openedWindows.remove(modalInstance),removeAfterAnimate(modalWindow.modalDomEl,modalWindow.modalScope,function(){body.toggleClass(OPENED_MODAL_CLASS,openedWindows.length()>0),checkRemoveBackdrop()}),elementToReceiveFocus&&elementToReceiveFocus.focus?elementToReceiveFocus.focus():body.focus()}function checkRemoveBackdrop(){if(backdropDomEl&&backdropIndex()==-1){var backdropScopeRef=backdropScope;removeAfterAnimate(backdropDomEl,backdropScope,function(){backdropScopeRef=null}),backdropDomEl=void 0,backdropScope=void 0}}function removeAfterAnimate(domEl,scope,done){function afterAnimating(){afterAnimating.done||(afterAnimating.done=!0,domEl.remove(),scope.$destroy(),done&&done())}var asyncDeferred,asyncPromise=null,setIsAsync=function(){return asyncDeferred||(asyncDeferred=$q.defer(),asyncPromise=asyncDeferred.promise),function(){asyncDeferred.resolve()}};return scope.$broadcast($modalStack.NOW_CLOSING_EVENT,setIsAsync),$q.when(asyncPromise).then(afterAnimating)}function broadcastClosing(modalWindow,resultOrReason,closing){return!modalWindow.value.modalScope.$broadcast("modal.closing",resultOrReason,closing).defaultPrevented}var backdropDomEl,backdropScope,OPENED_MODAL_CLASS="modal-open",openedWindows=$$stackedMap.createNew(),$modalStack={NOW_CLOSING_EVENT:"modal.stack.now-closing"};return $rootScope.$watch(backdropIndex,function(newBackdropIndex){backdropScope&&(backdropScope.index=newBackdropIndex)}),$document.bind("keydown",function(evt){var modal;27===evt.which&&(modal=openedWindows.top())&&modal.value.keyboard&&(evt.preventDefault(),$rootScope.$apply(function(){$modalStack.dismiss(modal.key,"escape key press")}))}),$modalStack.open=function(modalInstance,modal){var modalOpener=$document[0].activeElement;openedWindows.add(modalInstance,{deferred:modal.deferred,renderDeferred:modal.renderDeferred,modalScope:modal.scope,backdrop:modal.backdrop,keyboard:modal.keyboard});var body=$document.find("body").eq(0),currBackdropIndex=backdropIndex();if(currBackdropIndex>=0&&!backdropDomEl){backdropScope=$rootScope.$new(!0),backdropScope.index=currBackdropIndex;var angularBackgroundDomEl=angular.element('<div modal-backdrop="modal-backdrop"></div>');angularBackgroundDomEl.attr("backdrop-class",modal.backdropClass),modal.animation&&angularBackgroundDomEl.attr("modal-animation","true"),backdropDomEl=$compile(angularBackgroundDomEl)(backdropScope),body.append(backdropDomEl)}var angularDomEl=angular.element('<div modal-window="modal-window"></div>');angularDomEl.attr({"template-url":modal.windowTemplateUrl,"window-class":modal.windowClass,size:modal.size,index:openedWindows.length()-1,animate:"animate"}).html(modal.content),modal.animation&&angularDomEl.attr("modal-animation","true");var modalDomEl=$compile(angularDomEl)(modal.scope);openedWindows.top().value.modalDomEl=modalDomEl,openedWindows.top().value.modalOpener=modalOpener,body.append(modalDomEl),body.addClass(OPENED_MODAL_CLASS)},$modalStack.close=function(modalInstance,result){var modalWindow=openedWindows.get(modalInstance);return modalWindow&&broadcastClosing(modalWindow,result,!0)?(modalWindow.value.deferred.resolve(result),removeModalWindow(modalInstance,modalWindow.value.modalOpener),!0):!modalWindow},$modalStack.dismiss=function(modalInstance,reason){var modalWindow=openedWindows.get(modalInstance);return modalWindow&&broadcastClosing(modalWindow,reason,!1)?(modalWindow.value.deferred.reject(reason),removeModalWindow(modalInstance,modalWindow.value.modalOpener),!0):!modalWindow},$modalStack.dismissAll=function(reason){for(var topModal=this.getTop();topModal&&this.dismiss(topModal.key,reason);)topModal=this.getTop()},$modalStack.getTop=function(){return openedWindows.top()},$modalStack.modalRendered=function(modalInstance){var modalWindow=openedWindows.get(modalInstance);modalWindow&&modalWindow.value.renderDeferred.resolve()},$modalStack}]).provider("$modal",function(){var $modalProvider={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller","$modalStack",function($injector,$rootScope,$q,$templateRequest,$controller,$modalStack){function getTemplatePromise(options){return options.template?$q.when(options.template):$templateRequest(angular.isFunction(options.templateUrl)?options.templateUrl():options.templateUrl)}function getResolvePromises(resolves){var promisesArr=[];return angular.forEach(resolves,function(value){(angular.isFunction(value)||angular.isArray(value))&&promisesArr.push($q.when($injector.invoke(value)))}),promisesArr}var $modal={};return $modal.open=function(modalOptions){var modalResultDeferred=$q.defer(),modalOpenedDeferred=$q.defer(),modalRenderDeferred=$q.defer(),modalInstance={result:modalResultDeferred.promise,opened:modalOpenedDeferred.promise,rendered:modalRenderDeferred.promise,close:function(result){return $modalStack.close(modalInstance,result)},dismiss:function(reason){return $modalStack.dismiss(modalInstance,reason)}};if(modalOptions=angular.extend({},$modalProvider.options,modalOptions),modalOptions.resolve=modalOptions.resolve||{},!modalOptions.template&&!modalOptions.templateUrl)throw new Error("One of template or templateUrl options is required.");var templateAndResolvePromise=$q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));return templateAndResolvePromise.then(function(tplAndVars){var modalScope=(modalOptions.scope||$rootScope).$new();modalScope.$close=modalInstance.close,modalScope.$dismiss=modalInstance.dismiss;var ctrlInstance,ctrlLocals={},resolveIter=1;modalOptions.controller&&(ctrlLocals.$scope=modalScope,ctrlLocals.$modalInstance=modalInstance,angular.forEach(modalOptions.resolve,function(value,key){ctrlLocals[key]=tplAndVars[resolveIter++]}),ctrlInstance=$controller(modalOptions.controller,ctrlLocals),modalOptions.controllerAs&&(modalOptions.bindToController?angular.extend(modalScope,ctrlInstance):modalScope[modalOptions.controllerAs]=ctrlInstance)),$modalStack.open(modalInstance,{scope:modalScope,deferred:modalResultDeferred,renderDeferred:modalRenderDeferred,content:tplAndVars[0],animation:modalOptions.animation,backdrop:modalOptions.backdrop,keyboard:modalOptions.keyboard,backdropClass:modalOptions.backdropClass,windowClass:modalOptions.windowClass,windowTemplateUrl:modalOptions.windowTemplateUrl,size:modalOptions.size})},function(reason){modalResultDeferred.reject(reason)}),templateAndResolvePromise.then(function(){modalOpenedDeferred.resolve(!0)},function(reason){modalOpenedDeferred.reject(reason)}),modalInstance},$modal}]};return $modalProvider}),CarouselDirective.$inject=[],CarouselStepDirective.$inject=[],angular.module("superdesk-ui.carousel",["ngAnimate"]).directive("sdCarousel",CarouselDirective).directive("sdCarouselStep",CarouselStepDirective),WizardHandlerFactory.$inject=[],WizardDirective.$inject=[],WizardStepDirective.$inject=[],angular.module("superdesk-ui.wizard",[]).factory("WizardHandler",WizardHandlerFactory).directive("sdWizard",WizardDirective).directive("sdWizardStep",WizardStepDirective),sdDropdown.$inject=["$window"],sdDropdownAppendToBody.$inject=["$window"],angular.module("superdesk-ui.dropdown",[]).directive("dropdown",sdDropdown).directive("dropdownAppendToBody",sdDropdownAppendToBody),sdModal.$inject=["$document"],angular.module("superdesk-ui.modals",[]).directive("sdModal",sdModal),sdSwitch.$inject=[],angular.module("superdesk-ui.switch",[]).directive("sdSwitch",sdSwitch),sdCheck.$inject=[],angular.module("superdesk-ui.check",[]).directive("sdCheck",sdCheck),angular.module("superdesk-ui",["superdesk-ui.templates-cache","superdesk-ui.helper.dropdown","superdesk-ui.helper.modal","superdesk-ui.carousel","superdesk-ui.wizard","superdesk-ui.dropdown","superdesk-ui.modals","superdesk-ui.switch","superdesk-ui.check"]);
//# sourceMappingURL=superdesk-ui-framework.js.map