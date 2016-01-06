import hbs from 'htmlbars-inline-precompile';
// import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('lf-select', 'Integration | Component | lf-select', {
  integration: true
});

function setupSelect(context, isValid = true) {
  context.set('validateAction', () => { return { isValid };});
  context.set('value', 'val1');
  context.set('options', [
    { id: 'val1', name: 'Value 1'},
    { id: 'val2', name: 'Value 2'}
  ]);
  context.render(hbs`{{lf-select
    label="Select"
    property=value
    content=options
    name="value"
    valuePath="id"
    labelPath="name"
    validate=(action validateAction)
  }}`);
}

test(
  'it renders the select with all markup and proper option selected',
  function(assert) {
    setupSelect(this);

    assert.equal(this.$('.control-label').text().trim(), 'Select', 'it has proper label');
    assert.equal(this.$('.form-group').length, 1, 'it has a form-group div');
    assert.equal(
      this.$('select.form-control').val().trim(),
     'val1',
     'it selects the correct option '
   );
  }
);

test('it has no validation state when rendered', function(assert) {
  setupSelect(this);

  let $form = this.$('.form-group');
  assert.equal($form.attr('class'), 'ember-view form-group', 'it has no validation state when rendered');
});

test('it shows error validation state', function(assert) {
  setupSelect(this, false);

  let $form = this.$('.form-group');
  $form.trigger('blur').trigger('focusout');
  assert.equal($form.attr('class'), 'ember-view form-group has-error');
  this.set('validateAction', function() { return {isValid: true}; });
});

test('it shows success validation state', function(assert) {
  setupSelect(this, true);

  let $form = this.$('.form-group');
  this.$('.form-control').val('asd').trigger('focusout');
  assert.equal($form.attr('class'), 'ember-view form-group has-success');
});

test('it shows validation state only after focusOut', function(assert) {
  setupSelect(this, true);

  let $form = this.$('.form-group');
  $('.form-control option[value="val2"]').attr('selected', 'selected');

  assert.equal($form.attr('class'), 'ember-view form-group');
  $('.form-control').trigger('blur');
  assert.equal($form.attr('class'), 'ember-view form-group has-success');
});

test('it observes the property changes', function(assert) {
  setupSelect(this, true);

  this.set('value', 'val2');
  assert.equal(
    this.$('select.form-control').val().trim(),
   'val2',
   'it observes the property and changes to the correct option'
 );

});


test('it resets and hides validation state when property set to null', function(assert) {
  setupSelect(this, true);

  let $form = this.$('.form-group');
  $('.form-control option[value="val2"]').attr('selected', 'selected');
  $('.form-control').trigger('blur');

  this.set('value', null);
  assert.equal(
    $form.attr('class'),
    'ember-view form-group',
    'it has no validation state when property set to null'
  );

  assert.equal(
    $('.form-control option:selected').text().trim(),
    '-- select --',
    'it goes back to prompt when property set to null'
  );
});
