/**
 * @ngdoc overview
 * @name  ÅngsturmComposer (AngsturmComposer)
 * @description
 *
 * # ÅngsturmComposer
 *
 * Creates a composite object from multiple representations of correlated data, integrating
 * and overlaying properties and child objects with the same path/keys, and extending
 * objects with properties and child objects with new/unique path/keys.
 *
 * # ngstDecomp
 *
 * A filter which can be used when consuming Ångsturm composed objects, currently provides
 * and object with the structure:
 *
 * ```
 * {
 *     editor: { ... object with all composites mixed, only missing active item marking ... }
 *     settings: { ... structural, settings, and aspects object ... }
 * }
 * ```
 */
(function (undefined) {
  'use strict';
  /* global JSON3 */  
  
  var root = this,

    decompose;

  var Aspects;


  /**
   * @ngdoc factory
   * @name  ÅngsturmComposer (AngsturmComposer)
   * @description 
   *
   * Compose an object from a set of aspects and associated settings.  Decorate the object with
   * meta information required to use the object in different contexts, for different purposes,
   * etc, or to accomplish polymorphic behaviors.
   * 
   */
  angular.module('angsturm.services')
  .service('AngsturmComposer',
    [
      'Aspects',
      'Id',

      function (_Aspects, Id) {

        Aspects = _Aspects;
        Aspects.compose = this.compose;
        Aspects.Id = Id;

        return {
          compose: Composer.compose,
          decompose: decompose,
          recompose: recompose,
          order: order,
          createFrom: createFrom
        };

      }

    ]
  )
  .filter('ngstDecomp', function () {
      return function (item) {

        if ( ! angular.isObject(item) ) {
          return '';
        }

        var decomposed = {
          editor: decompose({ isFilter: true, settingsOnly: false }, undefined, jsonCopy(item)),
          settings: decompose({ isFilter: false, settingsOnly: true }, undefined, jsonCopy(item))
        };

        return decomposed;

      };
    }
  );

  /**
   * @ngdoc object
   * @name  Composer
   * 
   * Composer is the object which encapsulates funcationality relevant to compositing on top
   * of an existing model.  It inspects the 'aspect' markings on the object and based on the
   * given or default pipeline, decorates the model to create the composite object.
   * 
   * @param {Object} model    an object to build upon, which has an 'aspects' property.
   * @param {Array}  pipeline an optional array of strings describing which definitions
   *                          should be considering when performing the composition
   */
  var Composer = {
    init: function init (model, pipeline) {
      if ( ! (angular.isObject(model) &&
        angular.isObject(model.composite)) ) {
        model = angular.isObject(model) ? model : {};
        model.composite =
          angular.isObject(model.composite) ?
            model.composite :
              { aspects: {} }; // not sure where we need this, could be cruft
      }

      this.model = model;

      this.aspects = [];
      this.pipeline = pipeline || ['base','terser','labels','settings'];
      this.aspectVectors = Aspects;
      this.dataVectorProperty = this.pipeline[this.pipeline.length - 1];
      this.dataVector = model[this.dataVectorProperty] = (model[this.dataVectorProperty] || {});
      this.compositeVector = model.composite || (model.composite = {});
      this.interfaceVectorProperty = this.pipeline[0];
      this.interfaceVector = model[this.interfaceVectorProperty] = {};

      return this;
    },
    create: function () {
      return Object.create(this);
    },
    /**
     * compose takes a 'model' object and based on the 'aspect' properties of the object
     * and it's items: [] children, creates a heirarchical composite object of arbitrary
     * complexity.
     *
     * Based on defining aspects, components, and additional 'vectors', we are able to
     * give instructions to Ångsturm about the composite object.
     * 
     * @param  {Object} model    object which will serve as the basis for composition
     * @param  {Array}  pipeline an array of strings representing the keys/names for
     *                           vectors which are being used to store interface information,
     *                           default data, or other meta information.
     */
    compose: function compose(model, pipeline) {
      
      if ( model._Åcomposed ) {
        return;
      }

      if ( angular.isUndefined(model.aspects) ) {
        return;
      }

      var composed = Composer.create().init(model, pipeline);

      angular.forEach(model.aspects, composed.expandAspectReferences, composed);
      angular.forEach(composed.aspects, composed.composeAspect, composed);

      model._Åcomposed = true;
    
    },
    /**
     * expandAspectReferences takes the array of aspects in snake-case, which is
     * defined in model.aspects and creates
     * an expanded array of aspect names in lower-camel-case,
     * which represents a flattened view of all of the
     * aspect-within-aspect-within-aspect ... definitions
     *
     * Updates the aspects array on the calling composer object, and the array of
     * composite aspects on composer.model
     * 
     * @param  {Any} aspect    aspects defined by the _key parameter in the calling
     *                         object
     * @param  {String} _key   the aspect for which to read aspect definitions and sub-aspect
     *                         definitions and add them to the overall list of aspects
     *                         expressable by the calling object
     */
    expandAspectReferences: function expandAspectReferences (aspect, _key) {
      var composer = this,
        aspects = composer.aspects,
        compositeAspects = composer.model.aspects,
        key = isNaN(_key) ? _key : aspect,

        nterface = Aspects.interfaces[key] || key;

      if (angular.isArray(nterface)) {
        compositeAspects[key] = true;
        
        angular.forEach(nterface, expandAspectReferences, composer);
        return;
      }

      if (angular.isObject(nterface)) {
        compositeAspects[key] = JSON.stringify(nterface);
        aspects.push(key);
        return;
      }

      compositeAspects[key] = nterface || true;
      aspects.push(nterface);

    },
    /**
     * composeAspect 
     *
     * For this aspect, create a ComposerAspect object.  The ComposerAspect object is
     * responsible for accomplishing all of the composition related to that aspect.
     *
     * Also for this aspect, initialize the composite object's stored vectors with
     * default values (see initFromInterface) according to the aspect's interface.
     *
     * Composition is executed for each of the vectors in the 'middle' of the pipeline,
     * that is not the first and not the last vector ('base' and 'settings' by default).
     * 
     * @param  {String} aspect the key/name of the aspect which will be composed
     */
    composeAspect: function composeAspect(aspect) {
      
      var composer = this,
        pipeline = composer.pipeline,
        composerAspect = ComposerAspect.create().init(composer, aspect),

        aspectInterfaceVector
          = composer.aspectVectors[composer.interfaceVectorProperty][aspect];

      // middle of the pipeline, i.e. not the base and not the data
      pipeline = pipeline.slice(1, pipeline.length - 1);

      angular.forEach(aspectInterfaceVector, composer.initFromInterface, composer);

      // 'decorate' with properties from all the 'middle' vectors in the pipeline
      angular.forEach(pipeline, composerAspect.extendCompositeWithAspectVector, composerAspect);
    
    },
    /**
     * initFromInterface adds properties for each interface onto the composite object's
     * interfaceVector, dataVector, and compositeVector
     * 
     * @param  {Object} _default Default value for the interface vector, a copy of which
     *                           will be placed in the data vector.
     * @param  {String} setting  The name of the property we're adding to all of the required
     *                           vectors.
     */
    initFromInterface: function initFromInterface(_default, setting) {

      var composer = this,
        dataVector = composer.dataVector;

      // interface gets a reference to its defaults
      composer.interfaceVector[setting] = _default;

      // prime the settings object with the default, but make it a copy
      if ( angular.isUndefined(dataVector[setting]) ) {
        dataVector[setting] = jsonCopy(_default);
      }

      composer.compositeVector[setting] = { setting: dataVector[setting] };

    },
    /**
     * extendComposite updates the composite model's CompositeVector
     * with additional / changed properties
     * from the source object, respecting object references in order to make the composite
     * object decomposable
     * 
     * @param  {Object} extension an object which will extend the composite object
     * @param  {String} setting   the 'setting' (key) which will be updated by the extension
     */
    extendComposite: function extendComposite(extension, setting) {
      var composer = this;
      Composer.extend.apply(composer.compositeVector, [extension, setting]);
    },
    /* force recomposition (otherwise a 'cached' copy will be used) of an object */
    recompose: recompose,
    /* shortcut to utility method for reuse in other places, if needed */
    extend: extend
  };

  var ComposerAspect = {
    init: function init (composer, aspect) {
      this.composer = composer;
      this.aspect = aspect;

      return this;
    },
    create: function () {
      return Object.create(this);
    },
    extendCompositeWithAspectVector: function
      extendCompositeWithAspectVector(vector) {

      var composer = this.composer,
        aspect = this.aspect,

        aspectVector = composer.aspectVectors[vector][aspect];
      
      this.extendCompositeWithVector(aspectVector);

    },

    extendCompositeWithVector: function
      extendCompositeWithVector(vector) {
        angular.forEach(vector, this.composer.extendComposite, this.composer);
    }

  };

  /*
  BEGIN DECOMPOSE
  */

  decompose = function decompose (options, parent, item, key) {
    options.remove = options.remove || [];

    if ( ! angular.isObject(item) ) {
      return;
    }

    findEmptyObjectsForRemoval(options.remove, item, parent, key);
    
    alwaysRemoved(item);

    if ( ! options.isFilter) {
      whenUnfiltered(item);
    }

    if ( options.settingsOnly ) {
      whenSettings(item);
    }

    // recursively decompose all properties of the item
    angular.forEach(item, decompose.bind(this, options, item));
    removeEmptyObjects(options);

    findEmptyObjectsForRemoval(options.remove, item, parent, key);

    return item;
  };

  /**
   * Remove the properties from a composed item that should only be shown when we're using
   * the filter (i.e. is an non-angular 'ngstDecomp' filtered view)
   * 
   * @param  {Object} item Composed object
   */
  function whenUnfiltered (item) {
    item.base && delete item.base;
    item.composite && delete item.composite;
    item.ordered && delete item.ordered;
    item._Åcomposed && delete item._Åcomposed;
  }

  /**
   * Remove the properties from a composed object that should *not* be used when we're only
   * concerned with structure and settings.
   * 
   * @param  {Object} item Composed object
   */
  function whenSettings (item) {
    // For the moment we're including the aspects in the stored settings
    // item.aspects && delete item.aspects; 
  }

  /**
   * Remove the properties from a composed object that we always remove
   * 
   * @param  {Object} item Composed object
   */
  function alwaysRemoved (item) {
    item.currentItem && delete item.currentItem;
    item.active && delete item.active;
    item.parent && delete item.parent;
  }

  /**
   * Find objects which have no children, when we're looking at a child by key
   * or when we are looking at the object itself.
   * 
   * @param  {Array}  remove An array of objects describing which objects to remove
   * @param  {Object} item   Composed object that is being examined for empty property objects
   * @param  {Object} parent Parent composed object / object of the empty object 
   * @param  {String} key    Key where item is stored inside parent object
   */
  function findEmptyObjectsForRemoval (remove, item, parent, key) {
    if ( ! angular.isUndefined(parent) ) {
      if ( ( /* (angular.isUndefined(key) === false) || */ Object.keys(item).length === 0) ) {
        remove.push({ object: parent, key: key });
      }
    }
  }

  function removeEmptyObjects (options) {
    var remove;
    if (options.remove.length > 0) {
      while ( (remove = options.remove.shift()) ) {
        delete remove.object[remove.key];
      }
    }
  }

  /*
  END DECOMPOSE
   */

  /**
   * jsonCopy creates a deep copy of any object which can be converted into JSON
   * the only objects which this causes issues with are ones which contain
   * circular structures
   * 
   * @param  {Object} object JSON-compatible object
   * @return {Object}        Deep copy of source object
   */
  function jsonCopy (object) {
    var copy;

    try {
      copy = JSON3.parse(angular.toJson(object));
    } catch (e) {
      copy = angular.copy(object);
    }

    return copy;
  }

  /**
   * An object-sensitive version of extend, which respects object references.  When the object
   * exists on the target, the objects are merged.  When the object does not exist on the
   * target, a new object of the appropriate built-in type (Array or Object) is created.
   *
   * Extend is always called with the context set to the destination object, e.g. with the
   * context parameter of angular.forEach as seen in the recursion, or
   * extend.call(target, source, setting)
   * 
   * @param  {Object} source  the object from which you'd like to source new properties
   * @param  {String} setting an object key indicating which object properties to bring
   *                          from the source onto the target
   */
  function extend(source, setting) {

    var destination = this,
      outerDestination,
      isArray = angular.isArray(source),
      isObject = angular.isObject(source);

    // Primitives / strings go straight through, natch.
    if ( ! (isArray || isObject) ) {
      destination[setting] = source;
      return;
    }

    outerDestination = destination[setting];

    if ( angular.isUndefined(outerDestination) ) {
      outerDestination = destination[setting] = isArray ? [] : {};
    }

    angular.forEach(source, extend, outerDestination);
  }

  

  function recompose(model, pipeline) {
    
    model._Åcomposed = false;
    delete model.ordered;

    if (model &&
        model.composite
    ) {
      model.composite = { aspects: {} };
    }

    return Composer.compose(model, pipeline);
  }

  function order (model, property, orderBy) {
    if ( model.ordered ) {
      return;
    }

    if ( angular.isUndefined(model.composite) ) {
      return;
    }

    var ordered = createFrom.call(this, root.SortedObjectArray, orderBy, model[property]);

    angular.forEach(model.composite, function (v, k) {
      
      if ( ! angular.isObject(v) ) {
        return;
      }

      v._Åname = k;
      ordered.insert(v);
    });

    model[property] = ordered.array;

    return ordered;
  }

  /**
   * Create a new instance of constructor with the given arguments
   *
   * I like to be able to pass in both arrays of arguments
   * and primitives/objects.  This means you can't ever use
   * CreateFrom with array arguments that you want to send
   * as arrays, unless you wrap them, like so:
   * 
   * createFrom(constructor, [myArrayArgument], [[0,1,2,3,4]])
   * 
   * @param {Function} constructor Constructor function to use for instantiation
   * @param {placeholder} args     CreateFrom takes any number of arguments
   *                               any array argument is considered an array of
   *                               arguments to add at that position
   *                               so wrap arrays as described above
   */
  function createFrom(constructor, args) {
    var _args = [this],
      Creator,
      created;

    angular.forEach(arguments, function (v,i) {
      if (i === 0 || angular.isUndefined(v) ) { return; }
      _args[angular.isArray(v) ? 'concat' : 'push'](v);
    });

    // Apply and bind the arguments to the constructor to create
    // a no-argument constructor
    Creator = constructor.bind.apply(constructor, _args);
    created = new Creator();

    return created;
  }

  /*
  LAND OF ORPHAN DOCUMENTATION
   */
  

  /**
   * composeAspect takes an individual 'aspect' name and composes all of the associated
   * object properties on the target composite object.
   *
   * Execution is done in the context of the target, which is an instance of Composer,
   * and corresponds to the eventual composite model.
   * 
   * Properties/concepts of Composer used here include the pipeline, vectors in general,
   * and AspectInterfaceVectors.
   *
   * From each object that has an aspectInterfaceVectorProperty ('interfaces') referencing
   * the current aspect, we compose the final composite 'aspect interface'.
   * 
   * AspectInterfaceVectors consist of a mapping from snake-case 'foo-bar' to
   * lower-camel-case 'fooBar' references, or to an array of snake-case aspect names.
   *
   * For example:
   *
   * ```
   * {
   *     interfaces: {
   *         'aspect-container': [ 'aspect-background', 'aspect-foreground' ]
   *     }
   * }
   * ```
   *
   * When the mapping is to an array of aspect names, all of the referenced aspects,
   * and if they reference any aspects, ad infinitum, are combined into the final
   * 'aspect interface'.  The properties which are associated with an aspect, and multiple
   * aspects which compose an 'aspect interface' can be conceived of as a complex matrix
   * or coordinate system, which is the reason that the word 'vector' is used here.
   *
   * After the composer initializes itself with the aspect interface, all of the other
   * 'vectors' describing other systems which the composite object participates in,
   * are layered on top, in the order specified by the pipeline.
   * 
   * The pipeline is a list of keys describing which vectors have been specified in the
   * definition objects, and the order in which they should be applied.  The pipeline
   * must consist of at least ['interfaces','base','settings'], but can consist of n
   * elements.  These first two (interfaces and base) and last (settings) are treated
   * in a special way.
   *
   * The composeAspect method finishes it's work by extending the composite model with
   * information from the 'middle' vectors described in the pipeline, being 'base' and all
   * following vectors but 'settings'.
   * 
   * @param  {String} aspect Which aspect to compose
   */

}).call(this);