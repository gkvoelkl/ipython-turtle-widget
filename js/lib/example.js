//The MIT License (MIT)
//
//Copyright (c) 2018 G. Völkl
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var TurtleModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'TurtleModel',
        _view_name : 'TurtleView',
        _model_module : 'ipyturtle',
        _view_module : 'ipyturtle',
        _model_module_version : '0.2.4',
        _view_module_version : '0.2.4',
    })
});


// Custom View. Renders the widget model.
var TurtleView = widgets.DOMWidgetView.extend({
    render: function() {
        console.log('render');
        this.div = document.createElement('div');
        this.canvasFixed = this.model.get('_canvas_fixed');
        console.log('canvasFixed',this.canvasFixed);
        if (this.canvasFixed) {
             this.div.style.position = 'fixed';
        } else {
             this.div.style.position = 'static';
        }
        this.right = 50;
        this.div.style.right = this.right + "px";
        this.top = 140;
        this.div.style.top = this.top + "px";
        this.canvasWidth = this.model.get('_canvas_width');
        console.log('canvasWidth',this.canvasWidth);
        this.div.style.width = this.canvasWidth +"px";
        this.canvasHeight = this.model.get('_canvas_height');
        console.log('canvasHeight',this.canvasHeight);
        this.div.style.height = this.canvasHeight + "px";
        this.div.style.border = "thin solid #0000FF"
        this.div.style.background = "#efefef";
        this.div.className = 'turtle_div';
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width',this.canvasWidth.toString());
        this.canvas.setAttribute('height',this.canvasHeight.toString());
        this.canvas.style.width = this.canvasWidth +"px";
        this.canvas.style.height = this.canvasHeight + "px";
        this.div.appendChild(this.canvas);
        this.el.appendChild(this.div);
        this.canvas.className = 'turtle_canvas';

        this.isMouseDown = false;

        var context = this.canvas.getContext('2d');
        this.clearImageData = context.getImageData(0,0,this.canvas.width,this.canvas.height);
            
        this.drawTurtle();
        //this.value_changed();
        //this.model.on('change:value', this.value_changed, this);
    },

    drawTurtle: function(){
        this.turtleOn = this.model.get('_turtle_on');
        console.log('turtleOn',this.turtleOn);
        if (!this.turtleOn) return;
            
        this.turtleLocationX = Math.round(this.model.get('_turtle_location_x'));
        console.log('turtleLocationX',this.turtleLocationX);
        this.turtleLocationY = Math.round(this.model.get('_turtle_location_y'));
        console.log('turtleLocationY',this.turtleLocationY);
        this.turtleHeadingX = this.model.get('_turtle_heading_x');
        console.log('turtleHeadingX',this.turtleHeadingX);
        this.turtleHeadingY = this.model.get('_turtle_heading_y');
        console.log('turtleHeadingY',this.turtleHeadingY);

        this.turtleHeight = this.model.get('_turtle_height');
        console.log('turtleHeight',this.turtleHeight);
        this.turtleWidth = this.model.get('_turtle_width');
        console.log('turtleWidth',this.turtleWidth);
            
        var hX = 0.5 * this.turtleHeight * this.turtleHeadingX;
        var hY = 0.5 * this.turtleHeight * this.turtleHeadingY;

        var noseX = this.turtleLocationX + hX;
        var noseY = this.turtleLocationY + hY;

        var leftLegX = this.turtleLocationX - 0.5 * this.turtleWidth * this.turtleHeadingY - hX;
        var leftLegY = this.turtleLocationY + 0.5 * this.turtleWidth * this.turtleHeadingX - hY;

        var rightLegX = this.turtleLocationX + 0.5 * this.turtleWidth * this.turtleHeadingY - hX;
        var rightLegY = this.turtleLocationY - 0.5 * this.turtleWidth * this.turtleHeadingX - hY;
        
        var context = this.canvas.getContext('2d');
        context.setTransform(1,0,0,-1,this.canvas.width/2,this.canvas.height/2);
        this.imageData = context.getImageData(0,0,this.canvas.width,this.canvas.height);
        console.log(noseX,noseY);
        context.beginPath();
        context.moveTo(noseX,noseY);
        context.lineTo(rightLegX,rightLegY);
        context.lineTo(leftLegX,leftLegY);
        context.closePath();
        context.stroke();
   
    },
    
    update: function(){
        console.log('update');
        
        this.clearTurtle();
        
        this.line = this.model.get('_line');
        console.log(this.line.length);
        console.log(this.line);
        if (this.line.length >0){
            this.draw(this.line);
            this.line='';
            this.model.set('_lines',this.line);
            console.log('this.line',this.line);
            //this.touch();
        }
        
        this.drawTurtle();
        
        return TurtleView.__super__.update.apply(this);
    },
    
    draw: function(move){
        if (move == "clear") {
            this.clear();
            return;
        }
        var context = this.canvas.getContext('2d');
        context.setTransform(1,0,0,-1,this.canvas.width/2,this.canvas.height/2);
        console.log(this.canvas.width/2, this.canvas.height/2);
        console.log('draw');
        context.beginPath();
        var pos = move.split(" ");
        console.log(pos);
        context.moveTo(parseInt(pos[0]),parseInt(pos[1]));
        console.log(pos[0],pos[1]);
        context.lineTo(parseInt(pos[2]),parseInt(pos[3]));
        console.log(pos[2],pos[3]);
        context.strokeStyle=pos[4];
        console.log(pos[4]);
        context.closePath();
        context.stroke();
    },
    
    clearTurtle: function(){
        if (!this.imageData) return;
        var context = this.canvas.getContext('2d');
        context.putImageData(this.imageData, 0,0);
        this.imageData = null;        
    },
    
    clear: function(){
        var context = this.canvas.getContext('2d');
        context.putImageData(this.clearImageData,0,0); 
        console.log('clearRect');
    },
    events: {
        'keydown': 'keypress',
        'click': 'click',
        'mousemove': 'mousemove',
        'mouseup': 'mouseup',
        'mousedown': 'mousedown'
    },

    keypress: function(e) {
        console.log("keypress");
        var code = e.keyCode || e.which;
        //this.send({event: 'keypress', code: code});
    },

    click: function(e) {
        console.log("click");
        //this.send({event: 'click', button: e.button});
        /*var cordx = 0;
       var cordy = 0;
       if (!e) {
        var e = window.event;
       }
       if (e.pageX || e.pageY){
        cordx = e.pageX;
        cordy = e.pageY;
       }
       else if (e.clientX || e.clientY){
        cordx = e.clientX;
        cordy = e.clientY;
       }
       this.div.style.left = cordx.toString()+'px';
       this.div.style.top = cordy.toString()+'px';
       */
    },

    mousemove: function(e){
        console.log('mousemove');
        if (this.isMouseDown){
            this.mouseX = e.screenX - this.mouseX;
            this.mouseY = e.screenY - this.mouseY;
            this.right -= this.mouseX;
            this.top += this.mouseY;
            this.mouseX = e.screenX;
            this.mouseY = e.screenY;
            console.log('mouseX',this.mouseX);
            //this.div.style.left = cordx.toString()+'px';
            this.div.style.right = this.right + 'px';
            this.div.style.top = this.top +'px';
        }
    },

    drag: function(e){
        console.log('drag');
    },

    mousedown: function(e){
        console.log('mousedown');
        this.isMouseDown = true;
        this.mouseX = e.screenX;
        this.mouseY = e.screenY;
    },

    mouseup: function(e){
        console.log('mouseup');
        this.isMouseDown = false;
    },

    value_changed: function() {
        //this.el.textContent = this.model.get('value');
    }
});


module.exports = {
    TurtleModel : TurtleModel,
    TurtleView : TurtleView
};
