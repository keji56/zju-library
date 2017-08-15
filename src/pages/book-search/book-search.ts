import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LibraryService} from "../../services/library.service";
import {BookRecord} from "../../classes/book";
import {BookDetailPage} from "../book-detail/book-detail";



@IonicPage()
@Component({
  selector: 'page-book-search',
  templateUrl: 'book-search.html',
})
export class BookSearchPage {
  searchText:string;
  loading:Loading=null;
  setId:string;
  totalCount:number=-1;
  bulkLength:number=10;
  bookRecords:BookRecord[]=[];
  recordStartNumber:number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private librarySvc: LibraryService,
    private loadingCtrl: LoadingController
  ) {
    this.searchText=navParams.get('searchText');
  }

  ionViewDidLoad() {
    this.search();
  }

  showLoading(){
    if (this.loading==null) {
      this.loading=this.loadingCtrl.create({
        spinner: 'dots',
        content: '加载中'
      });
      this.loading.present();
    }
  }

  dismissLoading(){
    this.loading.dismiss();
    this.loading=null;
  }

  search(){
    this.showLoading();
    this.totalCount=-1;
    this.bookRecords=[];
    this.recordStartNumber=1;
    this.librarySvc.search(this.searchText).then((data)=>{
      this.setId=data.setId;
      this.totalCount=data.totalCount;
      this.loadRecords();
    });
    //TODO catch
  }

  loadRecords(){
    this.showLoading();
    this.librarySvc.present(this.recordStartNumber,this.bulkLength,this.setId).then(bookRecords=>{
      Array.prototype.push.apply(this.bookRecords,bookRecords);
      this.recordStartNumber+=this.bulkLength;
      console.log(bookRecords);
      this.dismissLoading();
    });
    //TODO catch
  }

  goBookDetail(bookRecord){
    this.navCtrl.push(BookDetailPage,{
      'id': bookRecord.id
    });
  }



}
