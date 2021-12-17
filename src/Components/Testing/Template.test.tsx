import React from 'react'
import renderer from 'react-test-renderer';
import { Template } from '../Template/template';

describe('Testing', () => {
    it('Component renders correctly', () => {
        const component = renderer.create(<Template />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
