// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Lucene.Net.Search;
using Lucene.Net.QueryParsers.Classic;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace CoreII.Business.ResourceLibrary
{
    public class ResourceLibrarySearch
    {
        private const LuceneVersion version = LuceneVersion.LUCENE_48;
        private readonly StandardAnalyzer _analyzer;
        private readonly SimpleFSDirectory _directory;
        private static IndexWriter _writer;

        public ResourceLibrarySearch()
        {
            string indexName = "lucene_index";
            string indexPath = Path.Combine(Environment.CurrentDirectory, indexName);
            var directoryInfo = new DirectoryInfo(indexPath);

            if (!directoryInfo.Exists)
            {
                directoryInfo.Create();
                Console.WriteLine("Directory created at: " + indexPath);
            }

            _directory = new SimpleFSDirectory(directoryInfo);
            _analyzer = new StandardAnalyzer(version);

            if (_writer == null)
            {
                var config = new IndexWriterConfig(version, _analyzer);
                _writer = new IndexWriter(_directory, config);
            }
        }

        public void AddToLuceneIndex(CoreII.Data.ResourceLibrary resource)
        {
            var doc = new Document
            {
                new StringField("File_Id", resource.File_Id.ToString(), Field.Store.YES),
                new TextField("File_Name", resource.File_Name ?? "", Field.Store.YES),
                new TextField("Description", resource.Description ?? "", Field.Store.YES),
                new TextField("Category_Name", resource.ResourceLibraryCategory?.Category_Name ?? "", Field.Store.NO)
            };

            AddDocumentToIndex(doc);
        }

        private void AddDocumentToIndex(Document doc)
        {
            try
            {
                _writer.AddDocument(doc);
                _writer.Commit();  // Commit changes to ensure they are written to disk
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while adding document to Lucene index: " + ex.Message);
                throw;
            }
        }

        public void AddDocumentsToIndex(IEnumerable<Document> documents)
        {
            try
            {
                foreach (var doc in documents)
                {
                    _writer.AddDocument(doc);
                }
                _writer.Commit();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to add documents to index: " + ex.Message);
                throw;
            }
        }




        public List<Document> SearchResources(string searchTerm)
        {
            using (var reader = DirectoryReader.Open(_directory))
            {
                var searcher = new IndexSearcher(reader);
                var fieldsToSearch = new[] { "File_Name", "Description","Name" };
                //var parser = new QueryParser(version, "File_Name",  _analyzer);
                var parser = new MultiFieldQueryParser(LuceneVersion.LUCENE_48, fieldsToSearch, _analyzer);
                var query = parser.Parse(searchTerm);
                var hits = searcher.Search(query, 10).ScoreDocs;

                return hits.Select(hit => searcher.Doc(hit.Doc)).ToList();
            }
        }

        public void UpdateDocumentInIndex(CoreII.Data.ResourceLibrary resource)
        {
            var doc = new Document
    {
        new StringField("File_Id", resource.File_Id.ToString(), Field.Store.YES),
        new TextField("File_Name", resource.File_Name ?? "", Field.Store.YES),
        new TextField("Description", resource.Description ?? "", Field.Store.YES),
        new TextField("Category_Name", resource.ResourceLibraryCategory?.Category_Name ?? "", Field.Store.YES)
    };

            try
            {
                lock (_writer)
                {
                    // First, delete the existing document
                    _writer.DeleteDocuments(new Term("File_Id", resource.File_Id.ToString()));

                    // Add the new document
                    _writer.AddDocument(doc);

                    // Commit changes to ensure they are written to the index
                    _writer.Commit();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error updating document in Lucene index: " + ex.Message);
                throw;
            }
        }

        public void DeleteDocumentFromIndex(int resourceId)
        {
            try
            {
                _writer.DeleteDocuments(new Term("File_Id", resourceId.ToString()));
                _writer.Commit();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting document from Lucene index: " + ex.Message);
                throw;
            }
        }


    }
}
