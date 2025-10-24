import { ElementRef, Renderer2 } from '@angular/core';
import { KafkafTableDirective } from './kafkaf-table';
import { TestBed } from '@angular/core/testing';

describe('KafkafTableDirective', () => {
  let mockLogger: { warn: jasmine.Spy };
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let directive: KafkafTableDirective;
  let element: HTMLElement;

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('Logger', ['warn']);
    mockRenderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass']);
    element = document.createElement('table');

    TestBed.configureTestingModule({
      providers: [
        { provide: Renderer2, useValue: mockRenderer },
        { provide: 'Logger', useValue: mockLogger },
        { provide: ElementRef, useValue: new ElementRef(element) },
      ],
    });

    directive = TestBed.inject(KafkafTableDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add classes when element is a <table>', () => {
    expect(directive).toBeTruthy();
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'table');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'is-hoverable');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(element, 'is-fullwidth');
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });
});
