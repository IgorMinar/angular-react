'use strict';
import {tagElementMap} from "./native_element";

var AppRegistry = require('AppRegistry');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');

//replacing the event handlers.
//This is better than replacing the module itself, because
//react native's packager gets confused if you have two packages 
//with the same name.
ReactNativeEventEmitter.receiveEvent = function(
	tag: number,
	topLevelType: string,
	nativeEventParam
) {
	if (!nativeEventParam.target) {
		throw "Expected all events to have a target!";
	}
	var element = tagElementMap[tag];
	nativeEventParam.target = element;
	console.log(tag, topLevelType.toLowerCase(), nativeEventParam);
	element.listenerCallback(topLevelType.toLowerCase(), nativeEventParam);
	// TODO: Don't call detectChanges on events that are not listened to.
	detectChanges();
}
ReactNativeEventEmitter.receiveTouches = function(
	eventTopLevelType: string,
	touches: Array<Object>,
	changedIndices: Array<number>
) {
	console.log(eventTopLevelType, touches, changedIndices)
	// TODO: detectChanges();
}

var NativeModules = require('NativeModules');
var ReactNativeTagHandles = require('ReactNativeTagHandles');

// required for angular:
var parse5Adapter = require('angular2/src/dom/parse5_adapter.js');
require('traceur/bin/traceur-runtime.js');
require('reflect-metadata/Reflect.js');

import {Component, View, Directive, bootstrap, bind, Renderer, appComponentRefToken, NgFor} from 'angular2/angular2';
import {internalView} from 'angular2/src/core/compiler/view_ref';

import {ReactNativeRenderer} from './renderer'




@Component({
	selector: 'todo-app',
	hostAttributes: {
		"position": "absolute",
		"top": 0,
		"bottom": 0,
		"left": 0,
		"right": 0,
		"padding": 5,
		"paddingTop": 15
	}
})
@View({
	template:
		  "<TextField (topsubmitediting)='submit($event)' placeholder='new item' height=40 fontSize=30></TextField>"
		+ "<ScrollView flex=1><View>" 
			+ "<View *ng-for='#item of items' flexDirection='row' height=40 fontSize=20 alignItems='center'>"
				+ "<switch width=61 height=31 paddingRight=10 (topchange)='remove(item)'></switch>"
				+ "<Text fontSize=20>{{item.label}}</Text>"
			+ "</View>"
		+ "</View></ScrollView>",
	directives: [NgFor]
})
class TodoAppComponent {
	myText = "";
	items = [];
	submit(event) {
		this.items.push({"label": event.text});
		event.target.setProperty("text", "");
	}
	remove(item) {
		console.log(this.items, this.items.indexOf(item))
		this.items.splice(this.items.indexOf(item), 1)
	}
}



var detectChanges = () => { };

AppRegistry.registerRunnable("dist", function() {
	parse5Adapter.Parse5DomAdapter.makeCurrent();

	bootstrap(TodoAppComponent, [
		ReactNativeRenderer,
		bind(Renderer).toAlias(ReactNativeRenderer)
	]).then( (appRef) => {
		var componentRef = appRef.injector.get(appComponentRefToken);
		var rootView = internalView(componentRef.location.parentView);
		detectChanges = () => rootView.changeDetector.detectChanges();
	});
});