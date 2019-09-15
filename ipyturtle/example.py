# The MIT License (MIT)
#
# Copyright (c) 2016 G. Völkl
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
import ipywidgets as widgets
import math
from traitlets import Unicode, Bool, Int, Float

@widgets.register
class Turtle(widgets.DOMWidget):
    """"""
    _view_name = Unicode('TurtleView').tag(sync=True)
    _model_name = Unicode('TurtleModel').tag(sync=True)
    _view_module = Unicode('ipyturtle').tag(sync=True)
    _model_module = Unicode('ipyturtle').tag(sync=True)
    _view_module_version = Unicode('^0.2.4').tag(sync=True)
    _model_module_version = Unicode('^0.2.4').tag(sync=True)
  
    _canvas_fixed = Bool(True).tag(sync=True)
    _canvas_width = Int(320).tag(sync=True)
    _canvas_height = Int(320).tag(sync=True)
    _turtle_on = Bool(True).tag(sync=True)
    _pen_on = True

    _turtle_height = Int(20).tag(sync=True)
    _turtle_width = Int(10).tag(sync=True)
    _turtle_location_x = Float(0.0).tag(sync=True)
    _turtle_location_y = Float(0.0).tag(sync=True)
    _turtle_heading = Float(90.0).tag(sync=True)

    _turtle_heading_x = Float(0).tag(sync=True)
    _turtle_heading_y = Float(1).tag(sync=True)

    _line = Unicode('').tag(sync=True)
    _current_color = "Black"
    _current_color_rgb = None

    def __init__(self, width=320, height=320, fixed=True):
        widgets.DOMWidget.__init__(self)
        self._canvas_width = width
        self._canvas_height = height
        self._canvas_fixed = fixed
        self._reset()

    def _reset(self):
        self._turtle_on = True
        self._pen_on = True
        self._turtle_location_x = 0
        self._turtle_location_y = 0
        self._turtle_heading = 90.0
        self._turtle_heading_x = 0.0
        self._turtle_heading_y = 1.0

    def position(self):
        return self._turtle_location_x, self._turtle_location_y

    def forward(self, length):
        precision = 4
        start = "{} {}".format(round(self._turtle_location_x,precision),
                               round(self._turtle_location_y,precision))
        self._turtle_location_x += length * self._turtle_heading_x
        self._turtle_location_y += length * self._turtle_heading_y
        end = " {} {}".format(round(self._turtle_location_x, precision),
                              round(self._turtle_location_y, precision))
        #print(start, end)
        if self._pen_on:
            color = self._current_color
            if len(self._current_color)==0:
                color = "rgb({},{},{})".format(self._current_color_rgb[0],
                                               self._current_color_rgb[1],
                                               self._current_color_rgb[2])
            self._line = start + end + " " + color


    def back(self, length):
        self.forward(-length)

    def heading(self):
        return self._turtle_heading

    def goto(self, x, y=None):
        if y is None:
            y = x[1]
            x = x[0]
        self._turtle_location_x = float(x)
        self._turtle_location_y = float(y)

    def setpos(self, x, y=None):
        return self.goto(x, y)

    def setposition(self, x, y=None):
        return self.goto(x, y)

    def left(self, degree=None):
        if degree is None:
            degree = 90
        self._turtle_heading += degree
        self._turtle_heading = self._turtle_heading % 360

        hx = math.cos(math.radians(self._turtle_heading))
        hy = math.sin(math.radians(self._turtle_heading))

        self._turtle_heading_x = hx
        self._turtle_heading_y = hy

    # def right(self, degree):  # Converting to optional degree
    def right(self, degree=None):
        if degree is None:
            degree = 90
        self.left(-degree)

    def penup(self):
        self._pen_on = False

    def pendown(self):
        self._pen_on = True

    def isdown(self):
        return self._pen_on

    def hideturtle(self):
        self._turtle_on = False

    def showturtle(self):
        self._turtle_on = True

    def isvisible(self):
        return self._turtle_on

    def reset(self):
        self._reset()
        self.pencolor(0, 0, 0)
        self.forward(0)
        self._line = 'clear'

    def pencolor(self,r=-1,g=-1,b=-1):
        if r == -1:
            if len(self._current_color)==0:
                return  self._current_color_rgb
            else:
                return self._current_color
        elif type(r) == str:
            self._current_color = r
            self._current_color_rgb = None
        else:
            self._current_color = ""
            self._current_color_rgb = (r,g,b)
        self.forward(0)
