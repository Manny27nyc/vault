import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | client count current', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    let model = EmberObject.create({
      config: {},
      activity: {},
    });
    this.model = model;
    this.tab = 'current';
  });

  test('it shows empty state when disabled and no data available', async function(assert) {
    Object.assign(this.model.config, { enabled: 'Off', queriesAvailable: false });
    await render(hbs`<Clients::History @tab={{tab}} @model={{model}} />`);

    assert.dom('[data-test-component="empty-state"]').exists('Empty state exists');
    assert.dom('[data-test-empty-state-title]').hasText('Data tracking is disabled');
  });

  test('it shows empty state when enabled and no data available', async function(assert) {
    Object.assign(this.model.config, { enabled: 'On', queriesAvailable: false });
    await render(hbs`<Clients::History @tab={{tab}} @model={{model}} />`);

    assert.dom('[data-test-component="empty-state"]').exists('Empty state exists');
    assert.dom('[data-test-empty-state-title]').hasText('No monthly history');
  });

  test('it shows empty state when data available but not returned', async function(assert) {
    Object.assign(this.model.config, { queriesAvailable: true, enabled: 'On' });
    await render(hbs`<Clients::History @tab={{tab}} @model={{model}} />`);
    assert.dom('[data-test-pricing-metrics-form]').doesNotExist('Date range component should not exists');
    assert.dom('[data-test-component="empty-state"]').exists('Empty state exists');
    assert.dom('[data-test-empty-state-title]').hasText('No data received');
  });

  test('it shows data when available from query', async function(assert) {
    Object.assign(this.model.config, { queriesAvailable: true, configPath: { canRead: true } });
    Object.assign(this.model.activity, {
      clients: 1234,
      distinct_entities: 234,
      non_entity_tokens: 232,
    });

    await render(hbs`<Clients::History @tab={{tab}} @model={{model}} />`);
    assert.dom('[data-test-pricing-metrics-form]').doesNotExist('Date range component should not exists');
    assert.dom('[data-test-tracking-disabled]').doesNotExist('Flash message does not exists');
    assert.dom('[data-test-client-count-stats]').exists('Client count data exists');
  });
});
