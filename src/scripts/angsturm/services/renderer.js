(function (undefined) {

  'use strict';
  'be excellent to each other';

  angular.module('angsturm.services')
  .constant('CONTAINER_TEMPLATE', 'renderer-items')
  .constant('ITEM_TEMPLATE', 'renderer-items')
  .factory('AngsturmRenderer', [

    '$templateCache',

    'PIPELINE',
    'CONTAINER_TEMPLATE',
    'ITEM_TEMPLATE',

    'Shared',
    'LayoutService',

    'AngsturmComposer',
    'AngsturmCompiler',
    'AngsturmMessages',

    function AngsturmRendererFactoryDefinition (

      $templateCache,

      PIPELINE,
      CONTAINER_TEMPLATE,
      ITEM_TEMPLATE,

      Shared,
      LayoutService,

      Åc,
      Åcmp,
      Åmsg

    ) {

      function decorateRendererScope ($s, $t, $a) {
        $s = $s || this.$scope, $t = $t || this.$template, $a = $a || this.$attrs;
        angular.extend($s, Renderer, { element: $t, attrs: $a });
      }

      function rerender(event, data) {
        var renderer = this,
          $s = this.$scope,
          layout = (data && data.value && data.value.layout) || $s.Shared.layout;

        renderer.$template.empty();
        $s.items = layout.items;
        $s.renderer.renderInner(true);
      }

      // it's an element!
      function renderElement ($s, $t, $a, layout) {
        var renderer = this;

        $s = $s || this.$scope, $t = $t || this.$template, $a = $a || this.$attrs;
        layout = layout || this.layout;

        if ($t.get(0).tagName.toLowerCase() !== 'renderer') {
          return false;
        }

        Åmsg.listen($s, 'layout:insert', $s.$id, renderer.rerender, 'this.layout', renderer);
        Åmsg.listen($s, 'component:change', null, renderer.rerender, 'this.layout', renderer);

        $s.item = $s.it = Shared.layout = layout; // PalletService.getLayoutTree();

        $s.items = $s.item.items;
        $s.pipeline = $a.pipeline ? $a.pipeline.split(',') : PIPELINE;

        $s.mode = $a.mode;

        $s.containerTemplate = $templateCache.get(($s.mode ? $s.mode + '-' : '') + CONTAINER_TEMPLATE + '.html');
        $s.itemTemplate = $templateCache.get(($s.mode ? $s.mode + '-' : '') + ITEM_TEMPLATE + '.html');

        return true;
      }

      function renderItem ($s, $t, item, index) {

        Åc.compose(item, $s.pipeline);

        var isContainer = !!(item && item.items.length > 0);

        if ( !isContainer && item.component && item.component.aspects ) {
          Array.prototype.splice.apply(item.aspects, [0,0].concat(item.component.aspects));
        }

        var $cs = $s.$new(false),
          $c = Åcmp.compile(angular.extend($cs, {
            item: item,
            items: item.items,
            template: isContainer ? $cs.containerTemplate : $cs.itemTemplate
          }));

        $t.append($c);
      }

      function renderItems ($s, $t, $a) {
        $s = $s || this.$scope, $t = $t || this.$template, $a = $a || this.$attrs;

        if ( (!$s.items) && $s.items.length <= 0 ) {
          return;
        }
        angular.forEach($s.items, this.renderItem.bind(this, $s, $t));

        return true;
      }

      function renderComponent($s, $t) {
        $s = $s || this.$scope, $t = $t || this.$template;

        $t.append(
          Åcmp.compile($s, {})
        );
      }

      function render (layout) {
        var renderer = this,
          $s = this.$scope;

        renderer.layout = layout;
        renderer.decorate();

        var isElement = renderer.renderElement();

        renderer.renderInner(isElement);
      }

      function renderInner (isElement) {
        var renderer = this,
          $s = this.$scope;

        Åc.compose($s.item, $s.pipeline);

        if (
          renderer.renderItems() || isElement
        ) {
          return;
        }

        // It's a component!
        renderer.renderComponent();
      }

      function pre ($s, $t, $a) {
        var renderer = this.init($s, $t, $a);
        LayoutService.layout.then(this.render.bind(renderer));
      }

      var Renderer = {
        nodeProperty: 'item',
        childrenProperty: 'items',
        process: Åcmp.process,

        pre: pre,
        post: angular.noop,

        decorate: decorateRendererScope,
        renderComponent: renderComponent,
        renderElement: renderElement,
        renderInner: renderInner,
        renderItem: renderItem,
        renderItems: renderItems,
        rerender: rerender,
        render: render,

        init: function ($s, $t, $a) {
          this.$scope = $s,
            this.$template = $t,
              this.$attrs = $a;

          return this;
        }
      };

      var RenderHelper = {
        pre: function ($s, $t, $a) {
          $s.renderer = Object.create(Renderer);
          $s.renderer.pre($s, $t, $a);
        },
        post: angular.noop
      };

      return RenderHelper;

    }
  ]);

}).call(this);
