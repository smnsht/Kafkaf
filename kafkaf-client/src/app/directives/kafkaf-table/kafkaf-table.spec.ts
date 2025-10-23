import { ElementRef, Renderer2 } from '@angular/core';
import { KafkafTableDirective } from './kafkaf-table';

describe('KafkafTableDirective', () => {
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockLogger: { warn: jasmine.Spy };

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass']);
    mockLogger = { warn: jasmine.createSpy('warn') };
  });

  it('should create an instance', () => {
    const element = document.createElement('table');
    const directive = new KafkafTableDirective(
      new ElementRef(element),
      mockRenderer,
      mockLogger as any,
    );

    expect(directive).toBeTruthy();
  });

  it('should add classes when element is a <table>', () => {
    const element = document.createElement('table');
    const directive = new KafkafTableDirective(
      new ElementRef(element),
      mockRenderer,
      mockLogger as any,
    );

    expect(directive).toBeTruthy();
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'table');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'is-hoverable');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'is-fullwidth');
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });
});
