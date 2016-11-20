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


@widgets.register('turtle.Turtle')
class Turtle(widgets.DOMWidget):
    """"""
    _view_name = Unicode('TurtleView').tag(sync=True)
    _model_name = Unicode('TurtleModel').tag(sync=True)
    _view_module = Unicode('ipython-turtle-widget').tag(sync=True)
    _model_module = Unicode('ipython-turtle-widget').tag(sync=True)

    _canvas_fixed = Bool(True).tag(sync=True)
    _canvas_width = Int(320).tag(sync=True)
    _canvas_height = Int(320).tag(sync=True)
    _turtle_on = Bool(True).tag(sync=True)
    _pen_on = True

    _turtle_height = Int(20).tag(sync=True)
    _turtle_width = Int(10).tag(sync=True)
    _turtle_location_x = Float(0.0).tag(sync=True)
    _turtle_location_y = Float(0.0).tag(sync=True)
    _turtle_heading = Int(90).tag(sync=True)

    _turtle_heading_x = Float(0).tag(sync=True)
    _turtle_heading_y = Float(1).tag(sync=True)

    _line = Unicode('').tag(sync=True)

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
        self._turtle_heading = 90
        self._turtle_heading_x = 0.0
        self._turtle_heading_y = 1.0

    def position(self):
        return (self._turtle_location_x, self._turtle_location_y)

    def forward(self, length):
        start = "{} {}".format(self._turtle_location_x, self._turtle_location_y)
        self._turtle_location_x += length * self._turtle_heading_x
        self._turtle_location_y += length * self._turtle_heading_y
        end = " {} {}".format(self._turtle_location_x, self._turtle_location_y)
        if self._pen_on:
            self._line = start + end

    def back(self, length):
        self.forward(-length)

    def heading(self):
        return self._turtle_heading

    def left(self, degree):
        self._turtle_heading += degree

        hx = math.cos(math.radians(self._turtle_heading))
        hy = math.sin(math.radians(self._turtle_heading))

        self._turtle_heading_x = hx
        self._turtle_heading_y = hy

    def right(self, degree):
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
        self._line = 'clear'
