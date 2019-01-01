import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from '../../models/File';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Planning } from '../../models/Planing';
import { HttpClient } from '@angular/common/http';
import { Configs } from '../../configs';

@Component({
    selector: 'step-files',
    styleUrls: ['./step-files.component.css'],
    templateUrl: './step-files.component.html'
})
export class StepFilesComponent implements OnInit {

    @Input() plan: Planning;
    @Input() step: Step;
    @Input() showUploadBox: boolean = true;

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    refreshFiles(status) {
        if (status) {
          this.fileService.loadFilesForPlan(this.plan._id).subscribe((files: Array<File>) => {
    
            files.forEach(() => {
              this.plan.files;
            });
          });
        }
      }
    
      addFilesToStep(newFiles, step) {
    
        if (!("files" in step)) {
          step.files = [];
        }
    
        step.files = step.files.concat(newFiles);
        this.planningService.setPlanning(this.plan);
    
      }
    downloadFile(file: File) {
        this.fileService.downloadFile(file);
    }

    deleteFileFromStep(index, step) {
        let self = this;
        this.findStep(step._id, (step) => {
            var file = step.files[index];
            self.http.delete(Configs.fileUrl + "/" + file.fileId).subscribe(function(err){
                console.log(err);
                step.files.splice(index, 1);
                self.planningService.setPlanning(self.plan);
            });
        });
    }


    private findStep(stepid, cb) {
        this.plan.steps.forEach(step => {
            if (step._id == stepid) {
                cb(step);
            }
        });
    }

}
