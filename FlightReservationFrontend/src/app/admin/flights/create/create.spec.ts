  import { ComponentFixture, TestBed } from '@angular/core/testing';

  import { CreateFlightComponent } from './create.component';

  describe('Create', () => {
    let component: CreateFlightComponent;
    let fixture: ComponentFixture<CreateFlightComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CreateFlightComponent]
      })
      .compileComponents();

      fixture = TestBed.createComponent(CreateFlightComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
