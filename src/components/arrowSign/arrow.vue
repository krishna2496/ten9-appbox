<template>
  <div class="stencilToolbarContainer">
    <div class="toolbarContainer">
      <div ref="tools" class="row">
        <p>General</p>
      </div>
      <el-collapse>
        <el-collapse-item v-for="(palette, paletteIndex) in Object.values(palettes)"
                          :title="palette['title']"
                          :name="palette['name']"
                          :key="paletteIndex"
        >
          <a v-for="(_, shapeIndex) in palette['shapes']"
             :shapeIndex="shapeIndex"
             :paletteIndex="paletteIndex"
             ref="dragItem"
             :key="shapeIndex"
             v-on:dblclick="addShape(shapeIndex)"
          >
          </a>
        </el-collapse-item>
      </el-collapse>
      
    </div>
    <div class="graphContainer" tabindex="1" ref="container" v-on:dblclick="doubleClick()"></div>
  </div>
</template>

<script>
import {
  mxUtils as MxUtils,
  mxGraph as MxGraph,
  mxEvent as MxEvent,
  mxCell as MxCell,
  mxKeyHandler as MxKeyHandler,
  mxRubberband as MxRubberBand,
  mxConstants as MxConstants,
  mxStencilRegistry as MxStencilRegistry,
  mxStencil as MxStencil,
  mxCodec as MxCodec,
  mxGraphModel as MxGraphModel,
  mxGeometry as MxGeometry,
  mxToolbar as MxToolbar,
} from 'mxgraph/javascript/mxClient'

const path = require('path')

export default {
  name: 'stencilToolbar',
  data() {
    return {
      graph: null,
      keyHandler: null,
      palettes: {},
      graphXml: ''
    }
  },
  methods: {
    createGraph() {
      this.graph = new MxGraph(this.$refs.container)
      this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
    },
    encode(graph) {
      const encoder = new MxCodec()
      const result = encoder.encode(graph.getModel())

      return MxUtils.getPrettyXml(result)
    },
    decode(graphXml, graph) {
      window['mxGraphModel'] = MxGraphModel
      window['mxGeometry'] = MxGeometry

      const xmlDocument = MxUtils.parseXml(graphXml)
      const decoder = new MxCodec(xmlDocument)
      const node = xmlDocument.documentElement

      decoder.decode(node, graph.getModel())
    },
    initGraph() {
      // if (this.R.isNil(this.graph)) {
      //   return
      // }
      MxEvent.disableContextMenu(this.$refs.container)

      this.rubberBand = new MxRubberBand(this.graph)
      this.graph.setCellsEditable(false) 
      this.keyHandler = new MxKeyHandler(this.graph)
      this.keyHandler.bindKey(46, () => {
        const cells = this.graph.getSelectionCells() || []

        this.graph.removeCells(cells, true)
      })

      this.graph.popupMenuHandler.factoryMethod = (menu) => {
        menu.addItem('Get Code', null, () => {
          this.graphXml = this.encode(this.graph)
          this.$alert(this.graphXml)
          this.$message('Code')
        })
        menu.addSeparator()
        menu.addItem('Select All', null, () => {
          console.log('menu',menu);
              this.graph.selectAll()
        })
        menu.addSeparator()
        menu.addItem('Remove All Data', null, () => {
          console.log('menu',this.graph.getSelectionCells());
              this.graph.selectAll()
              this.graph.removeCells()
        })
      }
    },
    addStencilPalette(title, name, file) {
      let req = MxUtils.load(file)
      let root = req.getDocumentElement()
      let shape = root.firstChild

      this.$set(this.palettes, name, {title, name, shapes: []})

      while (shape != null) {
        if (shape.nodeType === MxConstants.NODETYPE_ELEMENT) {
          const shapeName = shape.getAttribute('name')
          const w = shape.getAttribute('w')
          const h = shape.getAttribute('h')

          MxStencilRegistry.addStencil(shapeName, new MxStencil(shape))
          this.palettes[name]['shapes'].push({name: shape.getAttribute('name'), width: w / 2, height: h / 2})
        }

        shape = shape.nextSibling
      }
    },
    createThumb(item, width, height) {
      const tmpGraph = new MxGraph(document.createElement('div'))
      const thumbBorder = 2

      tmpGraph.labelsVisible = false
      tmpGraph.view.scaleAndTranslate(1, 0, 0)

      this.instanceGraph(tmpGraph, item, 0, 0, width, height)

      const bounds = tmpGraph.getGraphBounds()
      const s = Math.floor(Math.min((width - 2 * thumbBorder) / bounds.width, (height - 2 * thumbBorder) / bounds.height) * 100) / 100

      tmpGraph.view.scaleAndTranslate(s, Math.floor((width - bounds.width * s) / 2 / s - bounds.x), Math.floor((height - bounds.height * s) / 2 / s - bounds.y))

      const node = tmpGraph.view.getCanvas().ownerSVGElement.cloneNode(true)

      node.style.position = 'relative'
      node.style.overflow = 'hidden'
      node.style.cursor = 'move'
      node.style.width = `${width}px`
      node.style.height = `${height}px`
      node.style.left = `${thumbBorder}px`
      node.style.top = `${thumbBorder}px`
      node.style.display = 'inline-block'

      return node
    },
    initToolBar() {
      const domArray = this.$refs.dragItem

      if (!(domArray instanceof Array) || domArray.length <= 0 || this.R.isNil(this.graph)) {
        return
      }
      domArray.forEach(dom => {
        const shapeIndex = dom.getAttribute('shapeIndex')
        const paletteIndex = dom.getAttribute('paletteIndex')
        const shapeItem = Object.values(this.palettes)[paletteIndex]['shapes'][shapeIndex]
        const width = shapeItem['width']
        const height = shapeItem['height']
        const dragHandler = (graph, evt, cell, x, y) => {
          this.instanceGraph(this.graph, shapeItem, x, y, width, height)
        }
        const createDragPreview = () => {
          const elt = document.createElement('div')

          elt.style.border = '2px dotted black'
          elt.style.width = `${width}px`
          elt.style.height = `${height}px`
          return elt
        }
        dom.appendChild(this.createThumb(shapeItem, width, height))

        MxUtils.makeDraggable(dom, this.graph, dragHandler, createDragPreview(), 0, 0, false, true)
      })
    },
    instanceGraph(graph, shapeItem, x, y, width, height) {
      const parent = graph.getDefaultParent()

      graph.getModel().beginUpdate()
      try {
        let vertex = graph.insertVertex(parent, null, null, x, y, width, height, `shape=${shapeItem['name']};`)

        vertex.customer = true
      } finally {
        graph.getModel().endUpdate()
      }
    },
      doubleClick()
    {
      var doc = MxUtils.createXmlDocument();
      var node = doc.createElement('MyNode')
      node.setAttribute('label', 'MyLabel');
      node.setAttribute('attribute1', 'value1');
      this.graph.insertVertex(this.graph.getDefaultParent(), null, node, this.graph.lastMouseX, this.graph.lastMouseY, 80, 30);
    },
    addShape(index)
    {
      this.instanceGraph(this.graph,this.palettes.arrows.shapes[index],210,300,100,100);
    },
    //new code
        addToolbarItem(graph, toolbar, prototype, image) {
      let funct = function (graph, evt, cell, x, y) {
        graph.stopEditing(false)
        let vertex = graph.getModel().cloneCell(prototype)

        vertex.geometry.x = x
        vertex.geometry.y = y

        graph.addCell(vertex)
        graph.setSelectionCell(vertex)
      }
      let img = toolbar.addMode(null, image, function (evt, cell) {
        let pt = this.graph.getPointForEvent(evt)

        funct(graph, evt, cell, pt.x, pt.y)
      })

      MxEvent.addListener(img, 'mousedown', function (evt) {
        if (img.enabled === false) {
          MxEvent.consume(evt)
        }
      })
      MxUtils.makeDraggable(img, graph, funct)
      return img
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
    this.addStencilPalette('arrows', 'arrows', path.join('./arrows.xml'))
    this.$nextTick(() => {
      this.initToolBar()
    })

    //new code
      let tbContainer = document.createElement('div')

    tbContainer.style.position = ''
    tbContainer.style.overflow = 'hidden'
    tbContainer.style.padding = '2px'
    tbContainer.style.left = 'px'
    tbContainer.style.top = '0px'
    tbContainer.style.width = '410px'
    tbContainer.style.bottom = '0px'
    this.$refs.tools.appendChild(tbContainer)
   
    let toolbar = new MxToolbar(tbContainer)

    toolbar.enabled = false
   
  
    this.graph.setConnectable(true)
    this.graph.setMultigraph(false)

    let addVertex = (icon, w, h, style) => {
      let vertex = new MxCell(null, new MxGeometry(0, 0, w, h), style)

      vertex.setVertex(true)
      let img = this.addToolbarItem(this.graph, toolbar, vertex, icon)

      img.enabled = true
      this.graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
        let tmp = this.graph.isSelectionEmpty()

        MxUtils.setOpacity(img, (tmp) ? 100 : 20)
        img.enabled = tmp
      })
    }

    addVertex('./mxgraph/images/rectangle.gif', 100, 40, '')
    addVertex('./mxgraph/images/rounded.gif', 100, 40, 'shape=rounded')
    addVertex('./mxgraph/images/ellipse.gif', 40, 40, 'shape=ellipse')
    addVertex('./mxgraph/images/rhombus.gif', 40, 40, 'shape=rhombus')
    addVertex('./mxgraph/images/triangle.gif', 40, 40, 'shape=triangle')
    addVertex('./mxgraph/images/cylinder.gif', 40, 40, 'shape=cylinder')
    addVertex('./mxgraph/images/actor.gif', 30, 40, 'shape=actor')
    addVertex('./mxgraph/images/arrow.gif', 30, 40, 'shape=arrow')
    //end new code
  }
}
</script>

<style lang="scss">
.stencilToolbarContainer {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .toolbarContainer {
    flex: 2;
    font-size: 20px;
    background: #efefef;
    text-align: center;
    overflow: auto;
  }

  .graphContainer {
    outline: none;
    position: relative;
    flex: 7;
  }
}
.toolbarContainer {
  .row{
    img{
      width:35px;
      height: auto;
    }
  }
}
</style>
