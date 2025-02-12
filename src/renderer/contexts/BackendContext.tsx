import React, { memo, useMemo } from 'react';
import { createContext } from 'use-context-selector';
import { Backend, getBackend } from '../../common/Backend';
import { Category, PythonInfo, SchemaId } from '../../common/common-types';
import { SchemaInputsMap } from '../../common/SchemaInputsMap';
import { SchemaMap } from '../../common/SchemaMap';
import { FunctionDefinition } from '../../common/types/function';
import { useMemoObject } from '../hooks/useMemo';

interface BackendContextState {
    port: number;
    backend: Backend;
    schemata: SchemaMap;
    schemaInputs: SchemaInputsMap;
    pythonInfo: PythonInfo;
    /**
     * An ordered list of all categories supported by the backend.
     *
     * Some categories might be empty.
     */
    categories: Category[];
    categoriesMissingNodes: string[];
    functionDefinitions: Map<SchemaId, FunctionDefinition>;
}

export const BackendContext = createContext<Readonly<BackendContextState>>(
    {} as BackendContextState
);

interface BackendProviderProps {
    port: number;
    schemata: SchemaMap;
    pythonInfo: PythonInfo;
    categories: Category[];
    categoriesMissingNodes: string[];
    functionDefinitions: Map<SchemaId, FunctionDefinition>;
}

export const BackendProvider = memo(
    ({
        port,
        schemata,
        pythonInfo,
        categories,
        categoriesMissingNodes,
        functionDefinitions,
        children,
    }: React.PropsWithChildren<BackendProviderProps>) => {
        const backend = getBackend(port);

        const schemaInputs = useMemo(() => new SchemaInputsMap(schemata.schemata), [schemata]);

        const value = useMemoObject<BackendContextState>({
            port,
            backend,
            schemata,
            schemaInputs,
            pythonInfo,
            categories,
            categoriesMissingNodes,
            functionDefinitions,
        });

        return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>;
    }
);
