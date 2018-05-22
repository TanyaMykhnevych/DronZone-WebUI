import {Component, Input, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseModalComponent} from "../../../../../../common/base/baseModal.component";
import {NgForm} from "@angular/forms";
import {NotificationService} from "../../../../../../common/services/notificationService";
import {AppEnums} from "../../../../../../app.constants";
import {PreloaderService} from "../../../../../../common/services/preloaderService";
import {AreaFilterResource} from "../../../../../../common/resources/area-filter.resource";
import {AddAreaFilterViewModel, IAreaFilter} from "../../../../../../models/interfaces/area-filter";
import {Zone} from "../../../../../../models/interfaces/area.models";

@Component({
  selector: 'app-add-drone-filter-modal',
  templateUrl: './add-drone-filter-modal.html',
  styleUrls: ['./add-drone-filter-modal.scss']
})

export class AddDroneFilterModalComponent extends BaseModalComponent<any> {
  @Input('area') private area: Zone;

  public $submitted = false;

  constructor(modalService: NgbModal,
              private areaFilterResource: AreaFilterResource,
              private preloaderService: PreloaderService,
              private notificationService: NotificationService) {
    super(modalService);
  }

  public getDroneTypePresentation(droneType: number): string {
    return AppEnums.droneTypeReverse[droneType];
  }

  public showAdd() {
    this.$submitted = false;
    return this.showModalWithEntity({areaId: this.area.id} as AddAreaFilterViewModel);
  }

  public showEdit(entity: IAreaFilter) {
    this.$submitted = false;
    return this.showModalWithEntity(entity);
  }

  public saveOrEdit(form: NgForm): Promise<any> {
    this.$submitted = true;

    if (!form.valid) {
      return;
    }

    if (this.entity.id) {
      return this.save();
    } else {
      return this.create();
    }
  }

  public save(): Promise<any> {
    this.preloaderService.showGlobalPreloader();
    return this.areaFilterResource.update(this.entity).then((response: any) => {
      this.preloaderService.hideGlobalPreloader();
      this.notificationService.showSuccess("Filter has been updated successfully.");
      this.successClose();
    }, err => {
      this.preloaderService.hideGlobalPreloader();
      this.notificationService.showError("Unknown error. See console for details.");
      console.error(err);
      this.cancelClose();
    });
  }

  public create(): Promise<any> {
    this.preloaderService.showGlobalPreloader();
    return this.areaFilterResource.create(this.entity).then((response: any) => {
      this.preloaderService.hideGlobalPreloader();
      this.notificationService.showSuccess("Filter has been added successfully.");
      this.successClose();
    }, err => {
      this.preloaderService.hideGlobalPreloader();
      this.notificationService.showError("Unknown error. See console for details.");
      console.error(err);
      this.cancelClose();
    });
  }
}