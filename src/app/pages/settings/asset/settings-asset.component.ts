import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CentralServerService } from 'app/services/central-server.service';
import { ComponentService } from 'app/services/component.service';
import { MessageService } from 'app/services/message.service';
import { SpinnerService } from 'app/services/spinner.service';
import { RestResponse } from 'app/types/GlobalType';
import { HTTPError } from 'app/types/HTTPError';
import { AssetSettings } from 'app/types/Setting';
import TenantComponents from 'app/types/TenantComponents';
import { Utils } from 'app/utils/Utils';
import { SettingsAssetConnectionListTableDataSource } from './settings-asset-connections-list-table-data-source';


@Component({
  selector: 'app-settings-asset',
  templateUrl: './settings-asset.component.html',
})
export class SettingsAssetComponent implements OnInit {
  public isActive = false;

  public formGroup!: FormGroup;
  public assetSettings!: AssetSettings;

  constructor(
    private centralServerService: CentralServerService,
    private componentService: ComponentService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private router: Router,
    public assetConnectionListTableDataSource: SettingsAssetConnectionListTableDataSource) {
    this.assetConnectionListTableDataSource.changed.subscribe(() => {
      this.formGroup.markAsDirty();
    });
    this.isActive = this.componentService.isActive(TenantComponents.ASSET);
  }

  public ngOnInit(): void {
    if (this.isActive) {
      // Build the form
      this.formGroup = new FormGroup({});
      // Load the conf
      this.loadConfiguration();
    }
  }

  public loadConfiguration() {
    this.spinnerService.show();
    this.componentService.getAssetSettings().subscribe((settings) => {
      this.spinnerService.hide();
      // Keep
      this.assetSettings = settings;
      // Set
      this.assetConnectionListTableDataSource.setAssetConnections(this.assetSettings.assets);
      this.assetConnectionListTableDataSource.loadData().subscribe();
      // Init form
      this.formGroup.markAsPristine();
    }, (error) => {
      this.spinnerService.hide();
      switch (error.status) {
        case HTTPError.OBJECT_DOES_NOT_EXIST_ERROR:
          this.messageService.showErrorMessage('settings.asset.setting_not_found');
          break;
        default:
          Utils.handleHttpError(error, this.router, this.messageService,
            this.centralServerService, 'general.unexpected_error_backend');
      }
    });
  }

  public save(content: AssetSettings) {
    this.assetSettings = content;
    this.spinnerService.show();
    this.componentService.saveAssetConnectionSettings(this.assetSettings).subscribe((response) => {
      this.spinnerService.hide();
      if (response.status === RestResponse.SUCCESS) {
        this.messageService.showSuccessMessage(
          (!this.assetSettings.id ? 'settings.asset.create_success' : 'settings.asset.update_success'));
        this.refresh();
      } else {
        Utils.handleError(JSON.stringify(response),
          this.messageService, (!this.assetSettings.id ? 'settings.asset.create_error' : 'settings.asset.update_error'));
      }
    }, (error) => {
      this.spinnerService.hide();
      switch (error.status) {
        case HTTPError.OBJECT_DOES_NOT_EXIST_ERROR:
          this.messageService.showErrorMessage('settings.asset.setting_do_not_exist');
          break;
        default:
          Utils.handleHttpError(error, this.router, this.messageService, this.centralServerService,
            (!this.assetSettings.id ? 'settings.asset.create_error' : 'settings.asset.update_error'));
      }
    });
  }

  public refresh() {
    // Reload settings
    this.loadConfiguration();
  }
}
