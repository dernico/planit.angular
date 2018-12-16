import { Component, OnInit, Input } from '@angular/core';
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

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

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
