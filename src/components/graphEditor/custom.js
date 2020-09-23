import {
  mxCell as MxCell,
  mxEvent as MxEvent,
  mxGeometry as MxGeometry,
  mxUtils as MxUtils,
  mxPoint as MxPoint,
  mxClient as MxClient,
	mxGraph as MxGraph,
	mxConstants as MxConstants,
	mxEventObject as MxEventObject
} from 'mxgraph/javascript/mxClient'

//import {} from 'mxgraph/javascript/src/js/util/mxEventObject'

export function dblClick(vm,evt, cell)
		{
				var pt = MxUtils.convertPoint(vm.container, MxEvent.getClientX(evt), MxEvent.getClientY(evt));
                console.log('pt',pt);
                console.log('vm.graph',vm);
            	vm.isEnabled = function() { return true; }
      if (vm.isEnabled())
			{
				// Automatically adds new child cells to edges on double click
				if (evt != null && !vm.model.isVertex(cell))
				{
					var state = (vm.model.isEdge(cell)) ? vm.view.getState(cell) : null;
					var src = MxEvent.getSource(evt);
					console.log('state',state);
					console.log('src',src);

					vm.firstClickState = vm.view.getState();
					vm.firstClickSource = MxEvent.getSource(evt);

					if ((vm.firstClickState == state && vm.firstClickSource == src) &&
						(state == null || (state.text == null || state.text.node == null ||
						state.text.boundingBox == null || (!MxUtils.contains(state.text.boundingBox,
						pt.x, pt.y) && !MxUtils.isAncestorNode(state.text.node, MxEvent.getSource(evt))))) &&
						((state == null && !vm.isCellLocked(vm.getDefaultParent())) ||
						(state != null && !vm.isCellLocked(state.cell))) &&
						(state != null || (MxClient.IS_VML && src == vm.view.getCanvas()) ||
						(MxClient.IS_SVG && src == vm.view.getCanvas().ownerSVGElement)))
					  {
							if (state == null)
							{
								state = vm.view.getState(vm.getCellAt(pt.x, pt.y));
							}
							cell = addText(vm,pt.x, pt.y, state);
					  }
        }
			}
				MxGraph.prototype.dblClick.call(vm, evt, cell);

				function addText(vm,x, y, state)
				{
					// Creates a new edge label with a predefined text
					var label = new MxCell();
					label.value = 'Text';
					label.geometry = new MxGeometry(0, 0, 0, 0);
					label.vertex = true;
					var style = 'html=1;align=center;verticalAlign=middle;resizable=0;points=[];';

					if (state != null && vm.model.isEdge(state.cell))
					{
						label.style = 'edgeLabel;' + style;
						label.geometry.relative = true;
						label.connectable = false;
						
						// Resets the relative location stored inside the geometry
						var pt2 = vm.view.getRelativePoint(state, x, y);
						label.geometry.x = Math.round(pt2.x * 10000) / 10000;
						label.geometry.y = Math.round(pt2.y);
						
							// Resets the offset inside the geometry to find the offset from the resulting point
						label.geometry.offset = new MxPoint(0, 0);
						pt2 = vm.view.getPoint(state, label.geometry);
					
						var scale = vm.view.scale;
						label.geometry.offset = new MxPoint(Math.round((x - pt2.x) / scale), Math.round((y - pt2.y) / scale));
					}
					else
					{
						var tr = vm.view.translate;
						label.style = 'text;' + style;
						label.geometry.width = 40;
						label.geometry.height = 20;
						label.geometry.x = Math.round(x / vm.view.scale) -
							tr.x - ((state != null) ? state.origin.x : 0);
						label.geometry.y = Math.round(y / vm.view.scale) -
							tr.y - ((state != null) ? state.origin.y : 0);
						label.style += 'autosize=1;'
					}

					vm.getModel().beginUpdate();
					try
					{
										vm.addCells([label], (state != null) ? state.cell : null);
						vm.fireEvent(new MxEventObject('textInserted', 'cells', [label]));
						
							// Updates size of text after possible change of style via event
						vm.autoSizeCell(label);
					}
					finally
					{
						vm.getModel().endUpdate();
					}

					return label;
				}
      }
        
    export function rotate(vm){
			console.log('vm cell',vm)
			var stroke = MxUtils.getValue(vm.state.style, MxConstants.STYLE_STROKECOLOR, MxConstants.NONE);
			var fill = MxUtils.getValue(vm.state.style, MxConstants.STYLE_FILLCOLOR, MxConstants.NONE);
			
			if (vm.state.view.graph.model.isVertex(vm.state.cell) &&
				stroke == MxConstants.NONE && fill == MxConstants.NONE)
			{
				var angle = MxUtils.mod(MxUtils.getValue(vm.state.style, MxConstants.STYLE_ROTATION, 0) + 90, 360);
				vm.state.view.graph.setCellStyles(MxConstants.STYLE_ROTATION, angle, [vm.state.cell]);
			}
			else
			{
				vm.state.view.graph.turnShapes([vm.state.cell]);
			}
		}
        