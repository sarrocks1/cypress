import React from 'react'
import { mount } from '@cypress/react'
import { SpecList } from '../../../src/SpecList'
import { SpecFile } from '../../../src/SpecList/make-spec-hierarchy'
import { SpecFileItem } from '../../../src/SpecList/SpecFileItem'

const baseSpec: Cypress.Cypress['spec'] = {
  absolute: '/aaa',
  relative: 'aaa.js',
  name: 'aaa/aaa.js',
}

const spec: SpecFile = {
  ...baseSpec,
  name: 'foo-bar.js',
  shortName: 'foo-bar.js',
  type: 'file',
}

const specs: Cypress.Cypress['spec'][] = [
  {
    ...baseSpec,
    name: 'index.spec.js',
    absolute: 'index.spec.js',
  },
  {
    ...baseSpec,
    absolute: 'component/shared/bar.js',
    name: 'component/shared/bar.js',
  },
  {
    ...baseSpec,
    absolute: 'component/shared/runner.js',
    name: 'component/shared/runner.js',
  },
  {
    ...baseSpec,
    absolute: 'component/shared/spec-list.js',
    name: 'component/shared/spec-list.js',
  },
  {
    ...baseSpec,
    absolute: 'component/shared/utils/transform.js',
    name: 'component/shared/utils/transform.js',
  }
]

describe('SpecList', () => {
  it('selected and non selected spec', () => {
    const selectStub = cy.stub()
    const unselectedSpec = {...spec, shortName: 'unselected.spec.js'}
    mount(
      <ul style={{ position: 'relative' }}>
        <SpecFileItem
          spec={{...spec, shortName: 'selected.spec.js'}}
          selected={true}
          onSelectSpec={selectStub}
        />
        <SpecFileItem
          spec={unselectedSpec}
          selected={false}
          onSelectSpec={selectStub}
        />
      </ul>
    )

    cy.get('[data-cy="selected-spec"]')
      .contains('selected.spec.js')

    cy.get('[data-cy="unselected-spec"]')
      .contains('unselected.spec.js')
      .click()
      .then(() => {
        expect(selectStub).to.have.been.calledWith(unselectedSpec)
      })

  })

  it('renders an empty list', () => {
    mount(
      <SpecList 
        specs={specs}
        selectedSpecs={[]}
        onSelectSpec={() => {}}
      />
    )
  })

  it('opens and closes folders', () => {
    mount(
      <SpecList 
        specs={specs}
        selectedSpecs={['component/shared/utils/transform.js']}
        onSelectSpec={cy.stub()}
      />
    )

    ;['bar.js', 'runner.js', 'spec-list.js'].forEach(spec => {
      cy.get(`[data-cy="spec-${spec}"]`).should('exist')
    })

    cy.get('[data-cy="selected-spec"]').contains('transform.js')
    cy.get('[data-cy="spec-folder-shared"]').click()

    ;['bar.js', 'runner.js', 'spec-list.js'].forEach(spec => {
      cy.get(`[data-cy="spec-${spec}"]`).should('not.exist')
    })
  })

  it('filters the specs', () => {
    mount(
      <SpecList 
        specs={specs}
        selectedSpecs={[]}
        onSelectSpec={cy.stub()}
      />
    )

    cy.get('[placeholder="Find spec..."]').type('transform.js')


    cy.get(`[data-cy="spec-transform.js"]`).should('exist')

    ;['bar.js', 'runner.js', 'spec-list.js'].forEach(spec => {
      cy.get(`[data-cy="spec-${spec}"]`).should('not.exist')
    })
  })
})